# 🚀 Expense Tracker Backend (Node.js + PostgreSQL)

This is the robust, production-ready backend for the **Expense Tracker Expo App**. It features a modern architecture using TypeScript, Serverless PostgreSQL, and high-performance Rate Limiting.

---

### 🔗 Quick Links

- [Prerequisites](https://www.google.com/search?q=%23-prerequisites)
- [Setup Instructions](https://www.google.com/search?q=%23-how-to-setup-the-backend)
- [API Documentation](https://www.google.com/search?q=%23-api-overview)
- [Testing](https://www.google.com/search?q=%23-running-tests)
- [Author's Journey](https://www.google.com/search?q=%23-new-learnings)

---

### ⚡ In Short

- **Language:** TypeScript
- **Server:** Express.js
- **Database:** [Neon DB](https://www.google.com/search?q=https://neon.tech/) (Serverless PostgreSQL)
- **Rate Limiting:** [Upstash](https://www.google.com/search?q=https://upstash.com/) (Redis-based Serverless Rate Limiting)
- **Validation:** Custom logic with Jest for End-to-End testing.
- **Cron:** Automated pings to prevent server "cold starts."

---

### 🛠 How to Setup the Backend

Follow these steps to get your development environment running:

---

### 1️⃣ Clone the project

```bash
# Clone the entire repository
git clone https://github.com/Men6d656e/react_native_bootcamp.git

# Navigate to the backend directory
cd react_native_bootcamp/02_expense_tracker/backend
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Configure environment variables

Create a `.env` file in the `backend` folder and add:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL=your_neon_db_url
REDIS_URL=your_upstash_redis_url
API_URL=http://localhost:5001/api/health
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

---

### 4️⃣ Initialize the database

The server automatically checks and creates the `transactions` table on startup.

---

### 5️⃣ Run the server

```bash
npm run dev
```

---

### 📋 Overview of the Project

The backend is built with a **Stateless** architecture, ensuring it can scale easily. It follows a clean flow:
`Server -> Middleware (Upstash) -> Routes -> Controllers -> Database`.

#### **API Overview:**

| Method   | Endpoint                            | Description                       |
| -------- | ----------------------------------- | --------------------------------- |
| `GET`    | `/api/health`                       | Check server status               |
| `POST`   | `/api/transactions`                 | Create a new transaction          |
| `GET`    | `/api/transactions/:userId`         | Get all transactions for a user   |
| `GET`    | `/api/transactions/summary/:userId` | Get Balance, Income, and Expenses |
| `DELETE` | `/api/transactions/:id`             | Delete a specific transaction     |

---

### 🧪 Running Tests

This project uses **Jest** and **Supertest** for End-to-End testing. To verify the entire API flow:

```bash
npm test

```

_The tests automatically create test data, verify logic, and clean up after themselves._

---

### 🌟 New Learnings

This project was a major milestone in my development journey. Here is what I explored:

- **Upstash Exploration:** I discovered the power of **Serverless Redis**. Using Upstash was a "lightbulb moment"—realizing we need an ultra-fast, low-latency database for rate limiting. Integrating a serverless rate limiter ensures our main database (Neon) stays protected from spam.
- **Neon for Mobile:** While I have used **Neon DB** for web projects before, integrating it into a mobile app backend taught me how to handle serverless "cold starts" and managing database connections in a stateless environment.
- **Professional Testing:** I mastered the **Red-Green-Refactor** TDD cycle, ensuring that every API endpoint works perfectly before it ever reaches the mobile app.

---

### 👨‍💻 How to use this code

You can use this backend as a template for any CRUD-based mobile application. The `transactionsController.ts` can be easily adapted for other features like "Goals" or "Budgets."
