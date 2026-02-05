# Twitter Clone (API)

The robust backend infrastructure for the Twitter Clone mobile app. This API handles real-time data processing, secure authentication, and media management using **Express**, **MongoDB**, and **Clerk**.

## 🛠 Tech Stack

* **Runtime:** Node.js with TypeScript (`tsx`)
* **Framework:** Express.js (v5)
* **Database:** MongoDB via Mongoose
* **Auth:** @clerk/express (Webhook-ready synchronization)
* **Security:** **Arcjet** (Rate limiting & Bot protection)
* **Media:** Cloudinary (Image hosting) & Multer (Buffer handling)
* **Testing:** Jest & Supertest

## 🚀 Key Features

* **Authentication:** Secure middleware for protected routes via Clerk session validation.
* **User System:** Profile synchronization, follower/following logic, and unique username generation.
* **Content Engine:** CRUD operations for posts and comments with media upload support.
* **Social Graph:** Like/Unlike logic and automated notification triggers for social interactions.
* **Notifications:** RESTful endpoints to fetch and manage user activity alerts.
* **Security:** Implementation of Arcjet middleware for advanced request inspection and protection.

## 📂 Project Structure

```text
src/
├── controllers/    # Request handlers & Business logic
├── models/         # Mongoose schemas (User, Post, Comment, Notification)
├── routes/         # Express route definitions
├── middlewares/    # Auth, Error handling, Media uploads, & Arcjet
├── lib/            # Shared utilities (DB connection, Cloudinary config)
└── tests/          # Controller and Middleware unit/integration tests

```

## 🧪 Testing

The project is built with a focus on reliability.

```bash
# Run the test suite
npm test

```

## ⚙️ Setup

1. **Install:** `npm install`
2. **Env:** Create a `.env` file with the following:
* `MONGO_URI`, `PORT`
* `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`


3. **Run Dev:** `npm run dev`
4. **Build:** `npm run build`
