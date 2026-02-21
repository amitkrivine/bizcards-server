# BizCards Server

A RESTful API backend for managing business cards and users. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Initial Data](#initial-data)

## 🎯 About

BizCards is a backend API system that allows users to create, manage, and interact with business cards. The system supports three types of users: regular users, business users (who can create cards), and administrators.

## ✨ Features

- **User Management**
  - User registration and authentication
  - JWT-based authorization
  - Three user types: Admin, Business, and Regular users
  - Account security with failed login attempt tracking and temporary blocking
  - Profile management

- **Business Card Management**
  - Create, read, update, and delete business cards (CRUD operations)
  - Business users can create and manage their own cards
  - All users can view cards
  - Like/unlike functionality for cards
  - Unique business number generation for each card
  - Admin users have full control over all cards

- **Security Features**
  - Password encryption using bcrypt
  - JWT token-based authentication
  - Protected routes with middleware
  - Account lockout after failed login attempts

## 🛠 Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **Joi** - Data validation
- **bcrypt** - Password hashing
- **Morgan** - HTTP request logger
- **Chalk** - Terminal styling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (or local MongoDB installation)

## 🚀 Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd bizcards-server
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following variables:
```properties
   NODE_ENV=development
   PORT=8000
   DB_ATLAS=your_mongodb_atlas_connection_string
   DB_LOCAL=mongodb://localhost:27017/bizcards
   JWTKEY=your_secret_jwt_key
```

   **Important:** Replace the values with your actual credentials:
   - `DB_ATLAS`: Your MongoDB Atlas connection string
   - `DB_LOCAL`: Local MongoDB connection (optional fallback)
   - `JWTKEY`: A secure random string for JWT signing (keep this secret!)

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to the `.env` file

### JWT Secret Key

Generate a strong random string for your `JWTKEY`.

## 🏃 Running the Project

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:8000` (or the PORT specified in your `.env` file).

You should see the following console messages:
```
MongoDB connected
server is running on port 8000
```

### Testing the API

You can test the API using tools like:
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)
- **cURL**

## 📚 API Endpoints

### Users Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register a new user | No |
| POST | `/api/users/login` | Login user | No |
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user | Yes (Own account) |
| PATCH | `/api/users/:id` | Change business status | Yes (Admin) |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin/Own) |

### Cards Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cards` | Get all cards | No |
| GET | `/api/cards/my-cards` | Get user's cards | Yes |
| GET | `/api/cards/:id` | Get card by ID | No |
| POST | `/api/cards` | Create new card | Yes (Business) |
| PUT | `/api/cards/:id` | Update card | Yes (Owner) |
| PATCH | `/api/cards/:id` | Like/unlike card | Yes |
| DELETE | `/api/cards/:id` | Delete card | Yes (Owner/Admin) |

## 📁 Project Structure
```
bizcards-server/
├── models/
│   ├── Card.js          # Card schema
│   └── User.js          # User schema
├── routes/
│   ├── cards.js         # Card routes
│   ├── cardValidation.js # Joi validation schemas for cards
│   ├── users.js         # User routes
│   └── userValidation.js # Joi validation schemas for users
├── middlewares/
│   └── auth.js          # JWT authentication middleware
├── .env                 # Environment variables (not in repo)
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── server.js           # Main server file
└── README.md           # Project documentation
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### How to authenticate:

1. **Register or Login** to receive a JWT token
2. **Include the token** in the request header for protected routes:
```
   x-auth-token: <your-jwt-token>
```

### Example (using fetch):
```javascript
fetch('http://localhost:8000/api/cards/my-cards', {
  headers: {
    'x-auth-token': 'your-token-here'
  }
})
```

## 💾 Initial Data

The project requires initial data to be created in MongoDB Atlas:

### Required Users (3):

1. **Admin User**
   - Has `isAdmin: true`
   - Can manage all users and cards
   
2. **Business User**
   - Has `isBusiness: true`
   - Can create and manage business cards
   
3. **Regular User**
   - Standard user with viewing privileges

### Required Cards (3):

- Create 3 sample business cards using the business user account
- Each card should have complete information (title, description, phone, email, address, image)

### User Schema Fields:
```javascript
{
  name: { first, middle, last },
  email: string (unique),
  password: string (min 8 chars, 1 uppercase, 1 lowercase, 4 numbers, 1 special char),
  phone: string (Israeli format),
  image: { url, alt },
  address: { state, country, city, street, houseNumber, zip },
  isAdmin: boolean,
  isBusiness: boolean,
  failedLoginAttempts: number,
  blockedUntil: date
}
```

### Card Schema Fields:
```javascript
{
  title: string,
  subtitle: string,
  description: string,
  phone: string (Israeli format),
  email: string,
  web: string,
  image: { url, alt },
  address: { state, country, city, street, houseNumber, zip },
  bizNumber: number (auto-generated),
  likes: array of user IDs,
  user_id: string (creator)
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Middleware validates tokens for protected endpoints
- **Account Lockout**: Users are temporarily blocked after 3 failed login attempts
- **Input Validation**: Joi schemas validate all incoming data
- **CORS Enabled**: Configured for cross-origin requests

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Authentication Errors
- Verify the `JWTKEY` is set in `.env`
- Check if the token is included in request headers as `x-auth-token`
- Ensure the token hasn't expired

## 👨‍💻 Author

Created as part of HackerU Projects by Amit Krivine

## 📄 License

ISC

---

For questions or issues, please contact the project maintainer.
