package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"click-game-backend/utils"
)

type SignUpReq struct{ Email, Password, Name, Role string }

func SignUp(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		var req SignUpReq
		if err := c.BindJSON(&req); err!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid"}); return }
		users := db.Collection("users")	
		// check exists
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		if err := users.FindOne(ctx, bson.M{"email":req.Email}).Err(); err==nil {
			c.JSON(http.StatusBadRequest, gin.H{"message":"email exists"}); return
		}
		hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		u := bson.M{"email":req.Email, "password":string(hash), "name":req.Name, "role":req.Role, "createdAt":time.Now()}
		res, _ := users.InsertOne(ctx, u)
		c.JSON(http.StatusOK, gin.H{"id":res.InsertedID})
	}
}

type LoginReq struct{ Email, Password string }

func Login(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		var req LoginReq
		if err:=c.BindJSON(&req); err!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid"}); return }
		users := db.Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		var user bson.M
		if err := users.FindOne(ctx, bson.M{"email":req.Email}).Decode(&user); err!=nil { c.JSON(http.StatusUnauthorized, gin.H{"message":"invalid"}); return }
		if err := bcrypt.CompareHashAndPassword([]byte(user["password"].(string)), []byte(req.Password)); err!=nil { c.JSON(http.StatusUnauthorized, gin.H{"message":"invalid"}); return }
		// generate jwt
		id := user["_id"]
		token, _ := utils.GenerateJWT(id.(interface{}))
		c.JSON(http.StatusOK, gin.H{"token":token})
	}
}

// Simple OTP flow: store otps in collection with TTL index (create index externally or on first run)

type ResetReq struct{ Email string }

func RequestReset(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		var r ResetReq
		if c.BindJSON(&r)!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid"}); return }
		otps := db.Collection("otps")
		code := utils.RandDigits(6)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		_, _ = otps.InsertOne(ctx, bson.M{"email":r.Email, "code":code, "createdAt":time.Now()})
		// In real app email the code. Here return it so devs can test.
		c.JSON(http.StatusOK, gin.H{"otp":code})
	}
}

type DoResetReq struct{ Email, Code, NewPassword string }

func ResetPassword(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		var r DoResetReq
		if c.BindJSON(&r)!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid"}); return }
		otps := db.Collection("otps")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		var rec bson.M
		if err := otps.FindOne(ctx, bson.M{"email":r.Email, "code":r.Code}).Decode(&rec); err!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid code"}); return }
		users := db.Collection("users")
		hash, _ := bcrypt.GenerateFromPassword([]byte(r.NewPassword), bcrypt.DefaultCost)
		_, _ = users.UpdateOne(ctx, bson.M{"email":r.Email}, bson.M{"$set":bson.M{"password":string(hash)}})
		c.JSON(http.StatusOK, gin.H{"message":"ok"})
	}
}
