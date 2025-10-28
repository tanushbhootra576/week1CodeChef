# Frontend (Next.js + Tailwind + TypeScript)

Pages:
- `/` landing
- `/game` game page
- `/game-over` submit score
- `/leaderboard` view top scores

Setup:
1. cd frontend
2. npm install
3. Set NEXT_PUBLIC_API_BASE in `.env.local` (e.g., http://localhost:8080)
4. npm run dev

Notes:
- JWT is stored in localStorage under `jwt` key.
- API helper is `lib/api.ts` using axios.



# Backend (Go + Gin + MongoDB)

Run:
1. Install Go (1.20+)
2. Create a `.env` file in the `backend/` directory or set environment variables. An example `.env.example` is included.
3. go mod tidy
4. go run main.go (the server will auto-load `backend/.env` if present)

Endpoints:
- POST /auth/signup {email,password,name,role}
- POST /auth/login {email,password} -> {token}


Notes:
- JWT secret is in `utils/jwt.go` - change for production
- OTPs are stored in `otps` collection - add a TTL index on createdAt for expiry
 - OTPs are stored in `otps` collection - the server attempts to create a TTL index on `createdAt` (10 minutes) at startup.
 - Score submissions are intentionally open (no auth) to make it easy for players to submit scores from the frontend. If you prefer to require auth, change the route in `main.go`.

