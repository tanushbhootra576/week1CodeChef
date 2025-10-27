package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func PostScore(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		var body struct{ Name string `json:"name"`; Score int `json:"score"` }
		if c.BindJSON(&body)!=nil { c.JSON(http.StatusBadRequest, gin.H{"message":"invalid"}); return }
		scores := db.Collection("scores")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		_, err := scores.InsertOne(ctx, bson.M{"name":body.Name, "score":body.Score, "createdAt":time.Now()})
		if err!=nil { c.JSON(http.StatusInternalServerError, gin.H{"message":"fail"}); return }
		c.JSON(http.StatusOK, gin.H{"ok":true})
	}
}

func GetTopScores(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context){
		scores := db.Collection("scores")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel()
		// Find top scores sorted desc and limit to 10
		limit := int64(10)
		findOpts := options.Find().SetSort(bson.M{"score":-1}).SetLimit(limit)
		cur, err := scores.Find(ctx, bson.M{}, findOpts)
		if err!=nil { c.JSON(http.StatusInternalServerError, gin.H{"message":"fail"}); return }
		var out []bson.M
		if err := cur.All(ctx, &out); err!=nil { c.JSON(http.StatusInternalServerError, gin.H{"message":"fail"}); return }
		// already limited by query
		c.JSON(http.StatusOK, out)
	}
}
