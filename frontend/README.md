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
