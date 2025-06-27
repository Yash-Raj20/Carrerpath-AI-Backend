# 🔐 Secure User Authentication API

This is a full-featured, secure authentication system built with **Node.js**, **Express**, and **MongoDB**, using **JWT** stored in **HTTP-only cookies** for session-based login.

---

## 🚀 Features

- ✅ Register new users
- ✅ Login & Logout (cookie-based)
- ✅ Protected routes using middleware
- ✅ Get & update user profile
- ✅ Forgot password with reset token
- ✅ Input validation with express-validator
- ✅ Clean error handling & structure

---
```bash 
## 📁 Folder Structure

project-root/
│
├── controllers/ # Business logic for routes
│ └── AuthController/
│ └── UserController/
│
├── middleware/ # Auth, error, validate middleware
│
├── models/ # Mongoose models
│
├── routes/ # All Express routes
│
├── utils/ # Helper functions (e.g. token generation)
│
├── config/ # DB & environment setup
│
├── server.js # Entry point
└── app.js # Express app setup


---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

npm install

PORT=...
MONGO_URI=....
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

cd src
npm nodemon server.js


| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/register`        | Register new user         |
| POST   | `/api/auth/login`           | Login & set cookie        |
| POST   | `/api/auth/logout`          | Logout & clear cookie     |
| POST   | `/api/auth/forgot-password` | Generate reset token      |
| POST   | `/api/auth/reset-password`  | Reset password with token |


| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/user/profile` | Get user profile    |
| PUT    | `/api/user/update-profile` | Update user profile |


🔐 How Auth Works
On login/register, JWT is sent as a secure HTTP-only cookie.

Protected routes check for this cookie using middleware.

Logout clears the cookie.

Forgot/reset password system uses token stored in DB.


🧰 Tools & Tech Used
Express.js – Web framework

MongoDB + Mongoose – Database & ODM

JWT – Token-based authentication

cookie-parser – Cookie handling

express-validator – Request validation

bcryptjs – Password hashing

Made with ❤️ by Ratnesh Kumar