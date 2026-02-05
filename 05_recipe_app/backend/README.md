# Recipe App (Backend)

The server-side infrastructure for the Recipe App, built with **Express** and a relational database architecture. This project focuses on efficient data management for user favorites and scheduled tasks using **Drizzle ORM**.

## 🛠 Tech Stack

* **Runtime:** Node.js with TypeScript (`tsx`)
* **Framework:** Express.js (v5)
* **Database:** PostgreSQL (via **Neon Serverless**)
* **ORM:** **Drizzle ORM**
* **Testing:** Jest & Supertest

## 🚀 Key Features

* **Relational Data Modeling:** Optimized schema using Drizzle for managing user favorite recipes.
* **Favorites API:** Secure endpoints to add, retrieve, and remove user-specific recipes.
* **Type Safety:** Full end-to-end type safety from the database schema to the API response.
* **Database Migrations:** Streamlined workflow using `drizzle-kit` for schema pushes and studio management.

## 📂 Project Structure

```text
src/
├── db/             # Drizzle schema definitions
├── controllers/    # Request handlers
├── services/       # Business logic & Database queries
├── routes/         # Express API endpoints
├── config/         # Database, Cron, and Env configurations
└── tests/          # Integration tests for favorite logic

```

## ⚙️ Scripts

* `npm run dev`: Start development server with hot-reload.
* `npm run db:push`: Sync schema changes to Neon PostgreSQL.
* `npm run db:studio`: Open Drizzle Studio to visualize data.
* `npm test`: Execute the Jest test suite.

## 🔑 Environment Variables

Required variables in your `.env`:

* `DATABASE_URL`: Your Neon PostgreSQL connection string.
* `PORT`: Server port.

---

**Next Step:** Since you're using Drizzle and Neon now, would you like me to help you draft the **Mobile README** for this project to show how it connects to these PostgreSQL resources?