package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"click-game-backend/controllers"

)

func main(){
	// Load .env file if present (local development)
	_ = godotenv.Load()

	// Read environment variables
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI=="" { mongoURI = "mongodb://localhost:27017" }
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err!=nil { log.Fatal(err) }

	db := client.Database("clickgame")

	// Ensure TTL index for OTPs (expires after 10 minutes)
	otps := db.Collection("otps")
	idxModel := mongo.IndexModel{
		Keys: bson.D{{Key: "createdAt", Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(600),
	}
	if _, err := otps.Indexes().CreateOne(context.Background(), idxModel); err!=nil {
		log.Printf("warning: failed to create otp TTL index: %v", err)
	}

	r := gin.Default()
	// CORS - allow frontend dev server
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))
	r.GET("/", func(c *gin.Context){ c.String(http.StatusOK, "Click Game API") })

	// Auth
	r.POST("/auth/signup", controllers.SignUp(db))
	r.POST("/auth/login", controllers.Login(db))
	// OTP endpoints (simple)
	r.POST("/auth/request-reset", controllers.RequestReset(db))
	r.POST("/auth/reset-password", controllers.ResetPassword(db))

	// Scores
	s := r.Group("/scores")
	s.GET("/top", controllers.GetTopScores(db))
	// score submissions are open to make it easy for players to submit without auth
	s.POST("/", controllers.PostScore(db))

	port := os.Getenv("PORT")
	if port=="" { port = "8080" }
	log.Printf("listening on :%s", port)
	r.Run(":"+port)
}
