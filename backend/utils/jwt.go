package utils

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"os"
	"time"

	jwt "github.com/golang-jwt/jwt/v4"
)

// read secret from env if set
func jwtSecret() []byte {
	s := os.Getenv("JWT_SECRET")
	if s=="" { s = "please-change-this-secret" }
	return []byte(s)
}

func GenerateJWT(userId interface{}) (string, error){
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userId,
		"exp": time.Now().Add(7*24*time.Hour).Unix(),
	})
	return t.SignedString(jwtSecret())
}

func ValidateJWTToken(bearer string) (map[string]interface{}, error){
	var token string
	if len(bearer)>7 && bearer[:7]=="Bearer " { token = bearer[7:] } else { token = bearer }
	p, err := jwt.Parse(token, func(t *jwt.Token)(interface{}, error){
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok { return nil, errors.New("invalid") }
		return jwtSecret(), nil
	})
	if err!=nil { return nil, err }
	if claims, ok := p.Claims.(jwt.MapClaims); ok && p.Valid {
		out := map[string]interface{}{}
		for k,v := range claims { out[k]=v }
		return out, nil
	}
	return nil, errors.New("invalid token")
}

// RandHex returns a random hex string of length 2*n
func RandHex(n int) string{
	b := make([]byte, n)
	if _, err := rand.Read(b); err!=nil { return "000000" }
	return hex.EncodeToString(b)
}

// RandDigits returns a numeric string of length n using crypto randomness
func RandDigits(n int) string {
	digits := make([]byte, n)
	b := make([]byte, n)
	if _, err := rand.Read(b); err!=nil {
		for i := range digits { digits[i] = '0' }
		return string(digits)
	}
	for i := 0; i < n; i++ {
		digits[i] = byte('0' + int(b[i])%10)
	}
	return string(digits)
}
