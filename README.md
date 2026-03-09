# Event Management System (Groq AI + JWT + RBAC) ✅

A final-year BTech full-stack mini project.

✅ Frontend: React (Vite) + TailwindCSS (Glassmorphism / Liquid Glass UI)  
✅ Backend: Node.js + Express.js  
✅ MongoDB Atlas (free tier)  
✅ AI: Groq API → Auto-generate event descriptions  
✅ Security by default: JWT, bcrypt, RBAC, validation, sanitization, Helmet, rate limit, optional CSRF  

---

## Folder Structure
```
event-management-groq-rbac/
  frontend/
  backend/
  README.md
```

---

# Features

## User
- View all events
- Register for events

## Admin
- Add/update/delete events
- Groq AI: generate detailed event description from name/date/keywords
- Analytics: registrations count per event

---

# 1) Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Backend: `http://localhost:5000`

Set `.env`:
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`

---

# 2) Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend: `http://localhost:5173`

---

# 3) RBAC - Make Admin
All signups are created as `role=user`.

To make admin:
1. Signup once from UI
2. MongoDB Atlas → Collections → `users`
3. Update:
```json
"role": "admin"
```

Login again → admin features enabled.

---

# 4) Groq AI Setup
Get API key from **console.groq.com**

Backend `.env`:
```
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-8b-instant
```

---

# Deployment (Free Tier)

## Backend → Render
- Root: `backend`
- Build: `npm install`
- Start: `npm start`
- Add env vars

## Frontend → Vercel
- Root: `frontend`
- Add env:
```
VITE_API_BASE_URL=https://<render-backend-url>
```

---

# Security Points (Viva)
- bcrypt hashed passwords
- JWT authentication + expiry
- Logout invalidation via token blacklist (MongoDB TTL)
- Helmet secure headers
- Rate limiting
- Input validation + sanitization
- CSRF optional (`ENABLE_CSRF=1`)
- HTTPS ready for production

---

## Author
Final Year BTech Mini Project - Event Management System
