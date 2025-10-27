# Backend (Go + Gin + MongoDB)

Run:
1. Install Go (1.20+)
2. Create a `.env` file in the `backend/` directory or set environment variables. An example `.env.example` is included.
3. go mod tidy
4. go run main.go (the server will auto-load `backend/.env` if present)

Endpoints:
- POST /auth/signup {email,password,name,role}
- POST /auth/login {email,password} -> {token}
- POST /auth/request-reset {email} -> {otp}
- POST /auth/reset-password {email,code,newPassword}
- GET /scores/top -> top scores
 - POST /scores (open) {name,score}

Notes:
- JWT secret is in `utils/jwt.go` - change for production
- OTPs are stored in `otps` collection - add a TTL index on createdAt for expiry
 - OTPs are stored in `otps` collection - the server attempts to create a TTL index on `createdAt` (10 minutes) at startup.
 - Score submissions are intentionally open (no auth) to make it easy for players to submit scores from the frontend. If you prefer to require auth, change the route in `main.go`.
