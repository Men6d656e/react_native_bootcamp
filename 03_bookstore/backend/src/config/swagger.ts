import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "📚 Bookstore API - Professional Reference",
            version: "1.0.0",
            description: `
## Welcome to the Bookstore API Documentation
This documentation is designed for both developers and project stakeholders. 

### 🚀 Introduction
The Bookstore API is a robust, secure, and scalable backend solution built with Node.js, Express, and TypeScript. It allows users to manage their personal book collections, rate books, and store images in the cloud.

### 🛡️ Security & Authentication
We use **JSON Web Tokens (JWT)** for security. 
1. **Register** a new account.
2. **Login** to receive your access token.
3. Include the token in the headers of protected requests: \`Authorization: Bearer <your_token>\`.

### 📦 Key Features
- **User Management**: Secure signup/login with encrypted passwords.
- **Book CRUD**: Full Create, Read, Update, Delete capabilities.
- **Cloud Storage**: Automatic image optimization and storage via Cloudinary.
- **Smart Pagination**: High-performance data fetching for mobile apps.
            `,
            contact: {
                name: "API Support",
                email: "support@bookstore.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
                description: "Development Server",
            },
        ],
        tags: [
            {
                name: "Auth",
                description: "User registration, login, and session management",
            },
            {
                name: "Books",
                description: "Core bookstore features including uploads and listings",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
export default specs;
