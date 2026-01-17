# 📱 Project 01: Todo App (React Native + Expo)

A simple **Full-Stack Todo application** built with **React Native**, **Expo**, and **Convex**.
This project represents my **first step into mobile development**, coming from a web development background.

---

## 🔗 Quick Navigation

* [Features](#-features)
* [What I Learned](#-what-i-learned)
* [How to Use the App](#-how-to-use-the-app)
* [Run Locally](#-run-locally)
* [Backend Setup (Convex)](#-backend-setup-convex)
* [Build APK](#-build-apk)
* [Download APK](#-download-apk)

---

## ✨ Features

* Full **CRUD** operations for todos
* Two screens:

  * Todos
  * Settings
* Dark mode toggle
* Real-time backend using **Convex**
* Mobile-first UI with React Native components

---

## 🧠 What I Learned

* How mobile app architecture differs from web apps
* How **Expo** simplifies native development
* Using **AsyncStorage** instead of browser localStorage
* Thinking in React Native components (`View`, `Text`, `TouchableOpacity`)
* Building and testing apps using **Expo Go**
* Creating production Android builds using **EAS**

---

## 🧭 How to Use the App

1. Open the app
2. Add a new todo
3. Edit or delete existing todos
4. Open **Settings**
5. Toggle **Dark Mode**
6. All data syncs automatically via Convex

---

## ⚙️ Run Locally

### 1. Clone & Install

```bash
git clone <your-repository-url>
cd 01_todo_app_rn
npm install
```

---

### 2. Environment Variables

A sample file is provided.

```bash
sample-env.env → .env
```

Update the value:

```env
EXPO_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
```

Make sure `.env` and `.env.local` are in `.gitignore`.

---

## 🔌 Backend Setup (Convex)

Login and connect your Convex project:

```bash
npx convex dev
```

* Follow terminal prompts
* Create or link a Convex project
* Schema and config will sync automatically

Deploy backend functions:

```bash
npx convex deploy
```

---

## 📦 Build APK

This project is **configured for Android**.

Build using EAS:

```bash
eas build -p android --profile preview
```

For iOS builds, refer to the official Expo docs:
[https://docs.expo.dev/build/setup/](https://docs.expo.dev/build/setup/)

---

## ⬇️ Download APK

If you don’t want to build the app yourself:

1. Go to the **Releases** section of this repository
2. Download the latest **`.apk`**
3. Install it on your Android device

---

## ⚠️ Note About Free Tier Usage

This project uses the **Convex free tier** for backend services.

* The uploaded release APK will work **only while the free tier limits are not exceeded**
* If the limit is reached, backend features may stop working
* Before installing the APK, please **review and test carefully**

🔹 **Recommendation:**
I strongly suggest cloning the repository, connecting your own Convex project, and running or building the app yourself. This ensures full control, stability, and learning value.

---

**Developed by Akash**
*Simple learning. Clean execution.*
