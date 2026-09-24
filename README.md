# 📝 NotesLab

A full-stack MERN notes application with secure authentication, user-owned notes, guest mode, CRUD operations, rate limiting, and automated end-to-end testing with Playwright.

---

## 🚀 Live Demo

Coming soon.

---

## 📸 Preview

Screenshots will be added after deployment.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- Secure HttpOnly authentication cookies
- Password hashing with bcrypt
- Protected API routes
- Logout functionality
- User-specific notes

### 📝 Notes Management

- Create notes
- View notes
- Edit notes
- Delete notes
- Search notes
- Notes sorted by creation date
- Each user's notes are isolated from other users

### 👤 Guest Mode

- Use NotesLab without creating an account
- Create guest notes
- Edit guest notes
- Delete guest notes
- Guest notes persist using browser localStorage

### 🛡️ Security

- JWT authentication
- HttpOnly cookies
- Password hashing
- Protected backend routes
- User ownership validation
- API rate limiting with Upstash Redis
- CORS configuration
- Environment variables for secrets

### 🧪 Automated Testing

- Playwright end-to-end testing
- Guest CRUD testing
- Authentication ownership testing
- API security testing
- Cross-user access protection testing
- Desktop and mobile browser projects

### 📊 Current Test Status

**25 tests passed**

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- DaisyUI
- React Router
- Axios
- Lucide React
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- CORS

## Security & Infrastructure

- MongoDB Atlas
- Upstash Redis
- Upstash Ratelimit

## Testing

- Playwright

---

# 📁 Project Structure

```text
mern-thinkboard/
│
├── backend/
│   ├── SRC/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── lib/
│   │   └── pages/
│   │
│   ├── tests/
│   ├── playwright.config.js
│   ├── package.json
│   └── package-lock.json
│
├── postman/
├── .postman/
├── .gitignore
└── README.md