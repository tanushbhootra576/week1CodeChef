package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"click-game-backend/utils"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context){
		tok := c.GetHeader("Authorization")
		if tok=="" { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message":"missing"}); return }
		user, err := utils.ValidateJWTToken(tok)
		if err!=nil { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message":"invalid"}); return }
		c.Set("user", user)
		c.Next()
	}
}
