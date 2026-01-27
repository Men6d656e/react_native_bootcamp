# 📱 Bookstore Mobile App

A modern React Native mobile application for discovering and sharing book recommendations. Built with Expo, this app features seamless image capture, secure authentication, and a beautiful user interface for community book sharing.

## 🚀 Quick Navigation

- [Overview](#overview)
- [What I Learned](#what-i-learned)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Camera & Image Features](#camera--image-features)

---

## 📋 Overview

This mobile app is the frontend counterpart to the Bookstore API. It allows users to:
- Create an account and log in securely
- Browse community book recommendations
- Add their own book recommendations with photos
- Rate books from 1-5 stars
- Manage their profile and book collection
- Enjoy a smooth, native-like experience on iOS and Android

Built entirely with **Expo**, which handles the complexity of native development and lets the app focus on user experience and business logic.

---

## 🎓 What I Learned

### Expo: The Organized Factory
Expo is an incredible framework that acts like an organized factory for mobile apps. Instead of managing raw React Native, I learned how to:
- Leverage Expo's managed workflow for rapid development
- Use Expo modules for powerful native features
- Build for iOS, Android, and web from the same codebase
- Avoid boilerplate and focus on features

### Camera & Image Handling
One of the greatest milestones was mastering **camera integration and image handling**:
- Requesting camera and media library permissions
- Capturing photos directly from the device camera
- Picking images from the photo gallery
- Converting images to Base64 for API transmission
- Displaying images efficiently with `expo-image`

### Navigation & Routing
- Setting up tab-based navigation with Expo Router
- Implementing authentication-based routing (conditional screens)
- Managing navigation state across the app
- Handling deep linking and dynamic routes

### State Management
- Using Zustand for global state management
- Persisting authentication state to AsyncStorage
- Managing loading states and error handling
- Keeping user data synchronized across screens

### UI/UX Development
- Building responsive, mobile-first interfaces
- Using StyleSheet for performance-optimized styling
- Implementing bottom tab navigation
- Creating intuitive forms with proper input handling
- Safe area handling across different devices

### Async Operations & API Integration
- Making HTTP requests to the backend API
- Handling file uploads with Base64 encoding
- Managing async operations with proper loading states
- Implementing error handling and user feedback (Alerts)

### Authentication Flow
- Storing JWT tokens securely with AsyncStorage
- Including tokens in API requests
- Implementing automatic login on app startup
- Handling logout and session management

---

## 🛠️ Tech Stack

### Framework & Runtime
- **React Native** - Cross-platform mobile framework
- **Expo** - Managed development platform for React Native
- **TypeScript** - Type-safe JavaScript for better DX

### Navigation
- **Expo Router** - File-based routing (similar to Next.js)
- **React Navigation** - Navigation library
- **Bottom Tabs Navigation** - Tab-based UI

### State Management
- **Zustand** - Lightweight state management
- **AsyncStorage** - Local data persistence

### Expo Libraries (Native Features)
- **expo-image-picker** - Camera and photo gallery access
- **expo-file-system** - File system operations
- **expo-image** - Optimized image rendering
- **expo-haptics** - Vibration feedback
- **expo-linking** - Deep linking support
- **expo-vector-icons** - Icon library (Ionicons)
- **expo-status-bar** - Status bar customization

### UI & Styling
- **React Native** - Core UI components (View, Text, ScrollView, etc.)
- **Safe Area Context** - Safe area management
- **React Native Gesture Handler** - Touch gestures
- **React Native Reanimated** - Smooth animations

### HTTP & API
- **Axios/Fetch API** - HTTP requests to backend
- **Base64 encoding** - Image serialization

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Expo CLI** - Development server and build tools

---

## ✨ Features

### Authentication
- **Sign Up**: Create new account with username, email, and password
- **Login**: Secure authentication with JWT tokens
- **Auto Login**: Automatic session restoration on app startup
- **Logout**: Secure session termination

### Book Discovery
- **Browse Books**: View all community book recommendations
- **Book Details**: See ratings, descriptions, and cover images
- **Search & Filter**: Find books based on preferences
- **Pagination**: Smooth loading of large datasets

### Book Sharing
- **Create Recommendation**: Submit new books with:
  - Book title
  - Personal review/caption
  - 1-5 star rating
  - Book cover image (photo or gallery)
- **Image Capture**: 
  - Take photos directly with the camera
  - Pick images from photo library
  - Images automatically converted to Base64
- **Edit & Delete**: Manage your submissions

### User Profile
- **Profile Page**: View your information and book collection
- **Statistics**: See your rating history and contributions
- **Account Management**: Update profile information
- **Logout**: Secure session termination

### User Experience
- **Loading States**: Smooth spinners and feedback during operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation for user input
- **Responsive Design**: Adapts to all screen sizes

---

## 📱 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Either:
  - iOS Simulator (macOS)
  - Android Emulator (Windows/Mac/Linux)
  - Or the Expo Go app on a physical device

### Installation Steps

1. **Navigate to mobile directory**
```bash
cd 03_bookstore/mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Edit `constants/api.ts`:
```typescript
export const API_URL = 'http://your-backend-url:5000';
```

If running locally:
- **Android**: Use `http://10.0.2.2:5000`
- **iOS**: Use `http://localhost:5000`

4. **Start the Expo development server**
```bash
npm start
```

---

## 🚀 Running the App

### Option 1: Expo Go (Quickest)
```bash
npm start
```
Scan the QR code with the Expo Go app on your phone.

### Option 2: iOS Simulator
```bash
npm run ios
```

### Option 3: Android Emulator
```bash
npm run android
```

### Option 4: Web Browser
```bash
npm run web
```

---

## 🎥 Camera & Image Features

### Permission Handling
The app requests permissions when needed:
```typescript
// Media library permissions (Gallery)
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

// Camera permissions (Photo capture)
const { status } = await ImagePicker.requestCameraPermissionsAsync();
```

### Image Conversion
Images are converted to Base64 for API transmission:
```typescript
const base64 = await FileSystem.readAsStringAsync(
  selectedImage.uri,
  { encoding: FileSystem.EncodingType.Base64 }
);
```

### Upload Process
1. User selects/captures image
2. Image converted to Base64
3. Sent to backend with book details
4. Backend uploads to Cloudinary
5. Cloud URL stored in database
6. Image displays from cloud storage

---

## 📁 Project Structure

```
mobile/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout with auth navigation
│   ├── (auth)/                   # Auth screens (login/signup)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Login screen
│   │   └── signup.tsx            # Sign up screen
│   └── (tabs)/                   # Main app screens
│       ├── _layout.tsx           # Tab navigation
│       ├── index.tsx             # Home/Browse books
│       ├── create.tsx            # Create book recommendation
│       └── profile.tsx           # User profile
├── components/                   # Reusable components
│   ├── Loader.tsx                # Loading spinner
│   ├── LogoutButton.tsx          # Logout component
│   ├── ProfileHeader.tsx         # Profile header display
│   └── SafeScreen.tsx            # Safe area wrapper
├── constants/
│   ├── api.ts                    # API URL configuration
│   └── colors.ts                 # App color palette
├── hooks/                        # Custom React hooks
│   └── (custom hooks)
├── lib/
│   └── utils.ts                  # Utility functions
├── store/
│   └── authStore.ts              # Zustand auth state
├── assets/
│   ├── fonts/                    # Custom fonts
│   ├── images/                   # App icons and images
│   └── styles/                   # Component styles
├── types/
│   └── index.ts                  # TypeScript type definitions
├── package.json
├── tsconfig.json
├── app.json                      # Expo app configuration
└── eas.json                      # EAS Build configuration
```

---

## 🔐 Authentication Flow

1. **App Startup**: Checks AsyncStorage for stored token
2. **Auto-Login**: If token exists, automatically logs in user
3. **Login**: User enters credentials → receives JWT token
4. **Token Storage**: JWT stored in AsyncStorage for future sessions
5. **Protected Requests**: Token included in `Authorization` header
6. **Logout**: Token cleared from storage and memory

---

## 🎨 UI Components

### Core Components
- **SafeScreen**: Wraps content with safe area padding
- **Loader**: Full-screen loading spinner
- **LogoutButton**: Styled logout action button
- **ProfileHeader**: User information display

### Native Components
- **FlatList**: Efficient list rendering
- **ScrollView**: Scrollable content areas
- **TouchableOpacity**: Interactive buttons
- **TextInput**: Form inputs with keyboard handling
- **Image**: Optimized image display
- **ActivityIndicator**: Loading feedback

---

## 🌐 API Integration

### Endpoints Used

```typescript
// Authentication
POST /auth/register    // Create account
POST /auth/login       // Log in
POST /auth/logout      // Log out

// Books
POST /books            // Create recommendation
GET /books             // Browse all books
GET /books/user        // Your books
DELETE /books/:id      // Delete book
```

### Error Handling
The app includes:
- Network error detection
- Validation error messages
- Retry mechanisms
- User-friendly alerts

---

## 🚀 Next Steps & Enhancement Ideas

- Implement book search and advanced filtering
- Add favorites/wishlist feature
- Implement user-to-user messaging
- Add book review system
- Implement offline mode with sync
- Add push notifications for new recommendations
- Implement user profiles and follow system
- Add social sharing features
- Implement image cropping and filters
- Add accessibility features (screen reader support)

---

## 📊 Performance Optimization

The app uses several optimization techniques:
- **expo-image**: Optimized image rendering vs standard Image
- **FlatList**: Efficient list rendering with virtualization
- **Lazy Loading**: Pagination for large datasets
- **React.memo**: Component memoization to prevent re-renders
- **useMemo/useCallback**: Optimized function and value stability

---

## 🎯 Development Tips

### Hot Reload
The app supports Fast Refresh for instant code updates during development:
```bash
npm start  # Press 'r' to reload
```

### Debugging
- Use React Developer Tools extension
- Check console with `npm start` output
- Use `console.log()` for debugging
- Inspect network requests with Expo DevTools

### Testing Physical Devices
For testing on real devices:
1. Ensure device is on same network
2. Get your machine's IP address
3. In Expo menu, select "Tunnel" for internet connection

---

## 📝 Notes

- Requires functional Bookstore backend for API calls
- Ensure backend URL is correctly configured
- Camera permissions must be granted for image capture
- Images stored in cloud (Cloudinary) via backend
- JWT tokens persist across app restarts

---

## 🤝 Contributing

This is a bootcamp learning project. Refer to the main project README for contribution guidelines.

---

**Built with ❤️ using Expo - the organized factory for mobile apps.**
