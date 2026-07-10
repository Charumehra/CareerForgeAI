# 🚀 CareerForge

> An AI-powered career development platform that helps users create professional resumes, generate interview reports, and prepare for technical interviews.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-purple)

---

##  Overview

CareerForge is a full-stack MERN application designed to simplify career preparation. It enables users to build ATS-friendly resumes, manage profile information, generate AI-powered interview reports, and prepare for job interviews through an intuitive dashboard.

---

##  Features

###  Authentication
- User Registration
- Secure Login & Logout
- JWT Authentication
- Protected Routes
- Role-based Authorization

###  Resume Builder
- Create Resume
- Update Resume
- Delete Resume
- Download Resume as PDF
- ATS-Friendly Resume Templates

###  AI Features
- AI Resume Suggestions
- AI Interview Report Generation
- Personalized Feedback
- Resume Improvement Tips

###  Dashboard
- User Dashboard
- Resume Management
- Interview Reports
- Profile Management
- Career Progress Tracking

###  Security
- JWT Authentication
- Password Hashing using bcrypt
- HTTP-only Cookies
- Protected APIs
- Input Validation

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Framer Motion

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- CORS
- Zod Validation

## AI
- Google Gemini API

## Other Tools
- Git
- GitHub
- Postman
- Cloudinary (if used)
- Puppeteer (PDF Generation)

---

#  Project Structure

```
CareerForge/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---


#  API Modules

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/info
```

### Resume

```
POST   /api/resume
GET    /api/resume
PUT    /api/resume/:id
DELETE /api/resume/:id
GET    /api/resume/pdf/:id
```

### Interview

```
POST   /api/interview/report
GET    /api/interview/report/:id
DELETE /api/interview/report/:id
```


# 🚀 Future Improvements

- Multiple Resume Templates
- Cover Letter Generator
- AI Mock Interview
- Resume Score Analyzer
- Job Tracker
- Company-wise Interview Questions
- Dark Mode
- Email Notifications
- Admin Dashboard

---

# 👩‍💻 Author

**Charu Mehra**

- MERN Stack Developer
- React.js Developer
- Open Source Enthusiast

