import Constants from "expo-constants";

/**
 * Global configuration for the mobile app.
 */
export const Config = {
  /**
   * Base URL for the backend API.
   * Change this to your local IP for physical device testing.
   */
  BACKEND_API_URL: "https://react-native-bootcamp-1.onrender.com/api", // Replace with actual IP

  /**
   * Base URL for TheMealDB API.
   */
  MEAL_DB_API_URL: "https://www.themealdb.com/api/json/v1/1",

  /**
   * Clerk Publishable Key.
   */
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
};
