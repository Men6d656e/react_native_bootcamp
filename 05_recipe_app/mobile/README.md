# Recipe App (Mobile)

The frontend mobile application for the Recipe App, built with **React Native** and **Expo**. This project integrates a third-party culinary database with a custom PostgreSQL-backed favorites system, focusing on a premium UI/UX and secure user onboarding.

## 🚀 Key Features

* **Full Auth Flow:** Custom-styled Email/Password authentication and verification via **Clerk**.
* **Live Recipe Search:** Real-time recipe discovery powered by **TheMealDB API**.
* **Relational Favorites:** Persistent storage for favorite recipes using a custom **PostgreSQL (Drizzle)** backend.
* **Dynamic Routing:** Deep-linking and parameter-based routing for specific recipe details using **Expo Router**.


## 🛠 Tech Stack

* **Framework:** Expo (SDK 54) / TypeScript
* **Navigation:** Expo Router (File-based)
* **Authentication:** @clerk/clerk-expo
* **API Handling:** Fetch API with service-layer transformation
* **Icons:** Ionicons via `@expo/vector-icons`
* **Storage:** Expo Secure Store

## 📂 Navigation Structure

* `(auth)`: Onboarding, Sign-In, Sign-Up, and Email Verification.
* `(tabs)/index`: Featured recipes and category filtering.
* `(tabs)/search`: Global recipe search.
* `(tabs)/favorites`: User-specific saved recipes (Synced with PostgreSQL).
* `recipe/[id]`: Detailed view including ingredients, instructions, and YouTube links.

## ⚙️ Development & Build

### Local Setup

1. **Install:** `npm install`
2. **Env:** Set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in your `.env`.
3. **Configure:** Update `Config.ts` with your local IP or backend URL.
4. **Run:** `npx expo start`

### Production Build (EAS)

This project is configured for **Expo Application Services (EAS)**:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK)
eas build --platform android --profile preview

```