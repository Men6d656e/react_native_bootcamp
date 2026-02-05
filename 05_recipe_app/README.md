# Recipe App (Full Stack)

This is the **5th Project** of my React Native Bootcamp. This application marks a transition into relational data management, featuring a **PostgreSQL** backend and integration with external culinary APIs.

## 📁 Project Structure

The monorepo is divided into two specialized environments:

* **[`/mobile`](https://www.google.com/search?q=./mobile/README.md)**: An Expo-based mobile app featuring custom Clerk auth flows and a high-fidelity recipe discovery UI.
* **[`/backend`](https://www.google.com/search?q=./backend/README.md)**: A TypeScript Express server using **Drizzle ORM** and **Neon (PostgreSQL)** to manage user favorites and background tasks.

## 🚀 How to Run

To get the full experience, both the server and the mobile app must be configured:

1. **Backend:** Follow the instructions in the [Backend README](https://www.google.com/search?q=./backend/README.md) to set up your PostgreSQL instance via Neon and sync the schema using Drizzle.
2. **Mobile:** Follow the [Mobile README](https://www.google.com/search?q=./mobile/README.md) to configure your environment variables and start the Expo development server.

## 📦 Mobile Build & Demo

A pre-configured stable build is available for testing:

* Navigate to the **Releases** section.
* Download the generated **APK for Android**.
* Install directly to explore the search functionality and PostgreSQL-synced favorites.

## 🛠 Key Technical Milestones

* **Relational Persistence:** Migrated from NoSQL to **PostgreSQL** for structured user data.
* **Dual-API Architecture:** Combines **TheMealDB** for global recipe data with a custom **Drizzle API** for user-specific features.
* **Security:** Integrated **Clerk** for secure email verification and session management.
* **Build Pipeline:** Configured for **EAS (Expo Application Services)** for professional release management.