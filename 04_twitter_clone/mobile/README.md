# Twitter Clone (Mobile)

A full-stack social media frontend built with **React Native** and **Expo**. This project focuses on high-performance state management and a polished UI for social networking.

## 🚀 Key Features

* **Auth:** Social login (Google & Apple) via **Clerk**.
* **Feed:** Dynamic post rendering with Like/Comment functionality and Follow system.
* **Media:** Image uploads from Gallery/Camera using `expo-image-picker`.
* **Search:** Global post search functionality.
* **Notifications:** Real-time activity feed for interactions and new followers.
* **Messaging:** Static UI for user-to-user chat demonstrations.
* **Profile:** Comprehensive profile management (Bio, Location, Cover/Profile photos) and post management.

## 🛠 Tech Stack

* **Framework:** Expo (Router) / TypeScript
* **Styling:** NativeWind (Tailwind CSS)
* **State & Fetching:** TanStack Query (React Query) & Axios
* **Auth:** @clerk/clerk-expo
* **Icons:** Feather Icons

## 📂 Navigation Structure

The app uses a file-based tab navigation system:

* `index`: Main Feed (Newest first)
* `search`: Post Discovery
* `notification`: User Activity & Alerts
* `messages`: Direct Messaging UI
* `profile`: User Analytics & Settings

## ⚙️ Setup

1. **Install:** `npm install`
2. **Env:** Create a `.env` file with your `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_API_URL`.
3. **Run:** `npx expo start`