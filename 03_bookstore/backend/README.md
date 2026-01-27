# 📚 Bookstore API - Backend

A production-ready backend for a community book recommendation platform, built using **Test-Driven Development (TDD)** principles. This API allows users to securely manage their book collections, share recommendations, and upload book cover images with automatic cloud optimization.

## 🚀 Quick Navigation

- [Overview](#overview)
- [What I Learned](#what-i-learned)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Routes](#api-routes)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)

---

## 📋 Overview

This backend is built with a strong emphasis on **Test-Driven Development (TDD)**, where tests are written before implementation. The API features secure authentication using JWT tokens, book management CRUD operations, and seamless Cloudinary integration for image optimization. Every endpoint is thoroughly tested and documented using Swagger/OpenAPI.

### Key Highlights
- **TDD Architecture**: All features developed with comprehensive test coverage
- **JWT Authentication**: Secure user sessions and protected routes
- **Cloud Image Optimization**: Automatic image processing via Cloudinary
- **Comprehensive API Docs**: Multiple documentation endpoints (Swagger & ReDoc)
- **Error Handling**: Professional middleware for error management
- **Rate Limiting**: Protection against abuse with express-rate-limit
- **Scheduled Tasks**: Automated jobs using node-cron

---

## 🎓 What I Learned

### Test-Driven Development (TDD)
The most significant achievement of this project was mastering **TDD principles**. Instead of writing code first and testing later, I adopted the practice of:
1. Writing test cases first
2. Implementing features to pass those tests
3. Refactoring with confidence

This approach improved code quality, reduced bugs, and made the codebase more maintainable.

### Backend Architecture
- Structuring a scalable Express server with TypeScript
- Implementing proper separation of concerns (routes, controllers, middleware)
- Understanding MongoDB integration with Mongoose
- JWT token-based authentication and protected routes

### API Documentation & Developer Experience
- Creating professional API documentation using Swagger (OpenAPI 3.0)
- Serving documentation on multiple routes for flexibility
- Writing clear, descriptive endpoint descriptions for developer experience
- Understanding REST best practices

### DevOps & Cloud Services
- Cloud image storage and optimization with Cloudinary
- Environment variable management and security
- Database connection management
- Automated tasks with cron jobs

### Testing & Quality Assurance
- Writing unit and integration tests with Jest
- Using MongoDB Memory Server for isolated testing
- Mocking API responses and database calls
- Achieving robust code coverage

---

## 🛠️ Tech Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework (v5.2.1)
- **TypeScript** - Type safety and better DX

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Document Mapper) for MongoDB

### Authentication & Security
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Bcryptjs** - Password hashing
- **Helmet.js** - HTTP header security
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - API rate limiting

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory MongoDB for testing

### Cloud & APIs
- **Cloudinary** - Image optimization and storage

### Documentation
- **Swagger JSDoc** - OpenAPI documentation from code comments
- **Swagger UI Express** - Interactive API documentation
- **ReDoc Express** - Alternative professional API documentation

### Utilities
- **dotenv** - Environment variable management
- **node-cron** - Scheduled task management

---

## ✨ Features

### Authentication Module
- **User Registration**: Create new accounts with email, username, and password
- **User Login**: Authenticate and receive JWT tokens
- **Secure Logout**: Token invalidation and session management
- **Password Encryption**: Bcryptjs for secure password storage

### Book Management
- **Create Books**: Submit new book recommendations with cover images
- **Fetch All Books**: Browse all community recommendations with pagination
- **Fetch User Books**: View only your own book recommendations
- **Delete Books**: Remove your book entries

### Image Processing
- **Automatic Cloudinary Upload**: Images are processed and optimized
- **Base64 Image Encoding**: Mobile app sends images as Base64 strings
- **Cloud Storage**: Secure image hosting and delivery

### Additional Features
- **Rate Limiting**: Prevents API abuse
- **Error Middleware**: Comprehensive error handling
- **Scheduled Tasks**: Automated cleanup and maintenance jobs

---

## 📡 API Routes

### Authentication Endpoints

#### `POST /auth/register`
Register a new user account.
```
Body: {
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
Response: 201 Created
{
  "user": { "id", "username", "email", "avatar" },
  "token": "jwt_token_here"
}
```

#### `POST /auth/login`
Authenticate user and receive JWT token.
```
Body: {
  "email": "john@example.com",
  "password": "securePassword123"
}
Response: 200 OK
{
  "user": { "id", "username", "email", "avatar" },
  "token": "jwt_token_here"
}
```

#### `POST /auth/logout`
Logout user (requires authentication).
```
Headers: Authorization: Bearer <token>
Response: 200 OK
```

### Book Management Endpoints

#### `POST /books` (Protected)
Create a new book recommendation.
```
Headers: Authorization: Bearer <token>
Body: {
  "title": "The Great Gatsby",
  "caption": "A masterpiece of American literature",
  "rating": 5,
  "image": "base64_encoded_image_string"
}
Response: 201 Created
```

#### `GET /books`
Fetch all books with pagination.
```
Query: ?page=1&limit=10
Response: 200 OK
{
  "books": [ { "id", "title", "caption", "rating", "image", "author" } ],
  "total": 50,
  "page": 1
}
```

#### `GET /books/user`  (Protected)
Fetch only your own book recommendations.
```
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "books": [ { "id", "title", "caption", "rating", "image", "author" } ]
}
```

#### `DELETE /books/:id` (Protected)
Delete your book recommendation.
```
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "message": "Book deleted successfully"
}
```

---

## 🏗️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or connection string
- Cloudinary account for image storage
- Environment variables configured

### Installation Steps

1. **Navigate to backend directory**
```bash
cd 03_bookstore/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

4. **Start the development server**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

---

## 🧪 Running Tests

Execute the comprehensive test suite:

```bash
npm test
```

**What the tests cover:**
- Authentication (register, login, logout)
- Book CRUD operations
- JWT token validation
- Error handling
- Protected route access
- Cloudinary integration

---

## 📖 API Documentation

This API provides multiple documentation interfaces:

### Swagger UI (Interactive)
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

### ReDoc (Professional)
Alternative professional documentation:
```
http://localhost:5000/api-docs-redoc
```

Both provide:
- Interactive endpoint testing
- Request/response examples
- Parameter descriptions
- Authentication details
- Try-it-out functionality

---

## 🔐 Security Best Practices

1. **JWT Tokens**: Always included in `Authorization: Bearer <token>` header
2. **Password Hashing**: Bcryptjs ensures passwords are never stored in plain text
3. **Helmet.js**: HTTP headers are secured against common vulnerabilities
4. **Rate Limiting**: Prevents brute force attacks
5. **CORS**: Controlled cross-origin requests
6. **Environment Variables**: Sensitive data never committed to version control

---

## 📊 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── app.ts                # Express app configuration
│   ├── config/
│   │   ├── config.ts         # Environment configuration
│   │   └── swagger.ts        # Swagger/OpenAPI setup
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── book.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── book.routes.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   └── Book.model.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── lib/
│   │   ├── db.ts             # MongoDB connection
│   │   ├── cloudinary.ts     # Image upload
│   │   └── cron.ts           # Scheduled tasks
│   └── tests/
│       ├── auth.test.ts
│       └── books.test.ts
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## 🚀 Next Steps & Improvement Ideas

- Add refresh token rotation for enhanced security
- Implement book search and filtering features
- Add user profile management
- Implement review system for books
- Add email verification during registration
- Implement pagination for large datasets
- Add Redis caching for improved performance
- Setup CI/CD pipeline with GitHub Actions

---

## 📝 Notes

- All endpoints follow REST conventions
- Responses use standard HTTP status codes
- Error messages are descriptive and helpful
- The entire codebase follows TypeScript best practices

---

## 🤝 Contributing

This is a bootcamp project. For improvements or questions, refer to the main project documentation.

---

**Built with ❤️ using TDD principles and modern web development practices.**
