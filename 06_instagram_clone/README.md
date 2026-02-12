# Instagram Clone (Real-Time Full Stack)

This is **Project #06** of my React Native Bootcamp. This application represents the pinnacle of the series, moving away from traditional REST APIs to a **Real-Time Serverless Architecture**. It features instant UI updates, live notifications, and reactive data streams.

## 📁 Project Structure

The project is built as a unified monorepo:

* **`app/`**: The React Native (Expo) frontend, optimized for high-performance media rendering and reactive data subscriptions.
* **`convex/`**: The serverless backend engine. It contains the database schema, real-time mutations, and cloud storage logic.
* *For a deep dive into the backend logic, please refer to the [Convex README](https://www.google.com/search?q=./convex/README.md).*



## 🚀 Key Features

* **Reactive UI:** Instant updates for likes, comments, and follows—no manual refreshing required.
* **Media Engine:** Direct-to-storage image uploads and processing.
* **Social Graph:** Comprehensive follow/unfollow system with user-specific feeds.
* **Discovery:** Advanced profile views and bookmarked posts.
* **Live Notifications:** Real-time activity stream for social interactions.

## 🛠 Setup & Own Deployment

To use this code with your own resources, follow these steps:

### 1. Backend (Convex)

* Sign up at [Convex.dev](https://www.google.com/search?q=https://www.convex.dev).
* Run `npx convex dev` in the root folder to deploy the schema and functions.
* In your Convex Dashboard, add your `CLERK_WEBHOOK_SECRET`.

### 2. Authentication (Clerk)

* Create a project at [Clerk.com](https://www.google.com/search?q=https://clerk.com).
* Configure the JWT template for Convex.
* Set up a Webhook pointing to your Convex deployment URL (ending in `/clerk-webhook`).

### 3. Environment Variables

Create a `.env` file in the root with your credentials:

```env
CONVEX_DEPLOYMENT=your_deployment_name
EXPO_PUBLIC_CONVEX_URL=your_convex_url
EXPO_PUBLIC_CONVEX_SITE_URL=your_convex_site_url
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_CLERK_JWT_ISSUER_DOMAIN=your_clerk_issuer_url

```

### 4. Build (EAS)

To generate your own APK:

```bash
npm install -g eas-cli
eas build --platform android --profile preview

```

## 📦 Mobile Build & Demo

A stable build is available in the **Releases** section for immediate testing.


> **Maintenance Period:** The demo backend and Clerk services for the release build will be terminated after **3 months**. To continue using or testing the app after this period, you **must** follow the setup instructions above to deploy the infrastructure using your own Convex and Clerk accounts.
