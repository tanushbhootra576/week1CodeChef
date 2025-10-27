package models

import "time"

type User struct {
	ID string `bson:"_id,omitempty" json:"id"`
	Email string `bson:"email" json:"email"`
	Password string `bson:"password" json:"-"`
	Name string `bson:"name" json:"name"`
	Role string `bson:"role" json:"role"`
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}

type Event struct{
	ID string `bson:"_id,omitempty" json:"id"`
	Title string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`
	CreatorID string `bson:"creatorId" json:"creatorId"`
	StartsAt time.Time `bson:"startsAt" json:"startsAt"`
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}

type Score struct{
	ID string `bson:"_id,omitempty" json:"id"`
	UserID string `bson:"userId,omitempty" json:"userId"`
	Name string `bson:"name" json:"name"`
	Score int `bson:"score" json:"score"`
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}
