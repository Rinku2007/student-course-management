# Student Management System

Premium modern full-stack Student Management dashboard with dark/light mode.

## Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Upload: Multer

## Setup
1. Go to `backend`.
2. Copy `.env.example` to `.env`.
3. Update `MONGO_URI` and `JWT_SECRET`.
4. Install dependencies:
   - `npm install`
5. Start server:
   - `npm run dev`

Server runs on `http://localhost:5000` by default and serves frontend pages.

## Pages
- `/login.html`
- `/signup.html`
- `/index.html` (Dashboard)
- `/students.html`
- `/add-student.html`
- `/courses.html`
- `/settings.html`
