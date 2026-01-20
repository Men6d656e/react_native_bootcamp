# 📱 Expense Tracker Mobile (React Native)

This is the frontend component of the Expense Tracker application, built with **React Native** and **Expo**. It provides a sleek, intuitive interface for managing personal finances on the go.

## 🌟 Frontend Highlights

The primary focus of this module was mastering **Clerk Authentication** within a native environment. Moving from web to mobile required a different approach to session management and routing.

* **Native Auth Integration:** Implemented secure login and signup using the Clerk Expo SDK, utilizing `tokenCache` for persistent sessions.
* **OTP Verification Flow:** Built a custom UI to handle email-based One-Time Password (OTP) verification for new users.
* **Dynamic UI Layouts:** Leveraged `expo-router` to create protected route groups—ensuring the dashboard is only accessible to authenticated users.
* **Custom Hooks:** Developed `useTransactions` to abstract complex API logic, managing global loading and error states for a smooth UX.

## 🚀 Key Mobile Features

* **Interactive Dashboard:** Visual summary of Balance, Income, and Expenses with color-coded feedback.
* **Smart Transactions:** Category-specific iconography for quick identification of spending habits.
* **Gestures & Feedback:** Integrated `RefreshControl` for "pull-to-refresh" functionality and native `Alert` components for destructive actions like deletions.
* **Adaptive UI:** Styled with a custom color palette that remains consistent across different device sizes using Flexbox.

## 🛠️ Mobile Setup & Installation

1. **Navigate to the mobile directory:**
```bash
cd 02_expense_tracker/mobile

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Configuration:**
Create a `.env` file in the root of the mobile folder and add your Clerk credentials:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

```


4. **Connect to Backend:**
Update your `API_URL` in `@/constants/api.ts` to point to your deployed Render backend or your local IP address.
5. **Start the app:**
```bash
npx expo start

```



## 📦 Building for Android (APK)

This project is configured for **Expo EAS Build**. To generate a new APK:

1. Ensure you have `eas-cli` installed.
2. Run the preview build command:
```bash
eas build -p android --profile preview

```



---

### **GitHub Release Notes (v1.0.0)**

When you upload your APK to the GitHub Release section, you can use this short summary:

> **Version 1.0.0 - Initial Release**
> * Full integration with Clerk for secure mobile authentication.
> * Complete CRUD functionality for transactions.
> * Integrated custom balance summary cards.
> * **Note:** This APK connects to a demo backend active for 3 months. For long-term use, please deploy your own backend using the instructions in the main repository.
> 
> 
