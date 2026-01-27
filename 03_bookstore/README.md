# 📚 Bookstore: Full-Stack Book Recommendation Platform

A complete, production-ready full-stack application for sharing and discovering book recommendations. This project demonstrates modern web and mobile development practices with a **Test-Driven Development (TDD)** backend and feature-rich React Native mobile app using Expo.

## 🚀 Quick Start

```bash
# Backend Setup
cd backend
npm install
npm run dev      # Start development server on port 5000

# Mobile Setup (in a new terminal)
cd ../mobile
npm install
npm start        # Start Expo development server
```

> **⚠️ For detailed setup instructions, see the individual README files in each folder.**

---

## 📋 Project Overview

This repository contains a complete book recommendation platform with:

| Component | Purpose | Technology |
|-----------|---------|-----------|
| **Backend** | RESTful API with TDD architecture | Node.js, Express, TypeScript, MongoDB |
| **Mobile** | Cross-platform mobile app | React Native, Expo, TypeScript |
| **Cloud Storage** | Image hosting and optimization | Cloudinary |
| **Database** | User and book data persistence | MongoDB |

---

## 🎯 What This Project Demonstrates

### Backend Development
- ✅ **Test-Driven Development (TDD)** - Write tests first, code after
- ✅ **REST API Design** - Proper HTTP methods and status codes
- ✅ **Authentication** - JWT token-based security
- ✅ **Database Design** - MongoDB schema modeling with Mongoose
- ✅ **API Documentation** - Interactive docs with Swagger and ReDoc
- ✅ **Error Handling** - Comprehensive middleware and error messages
- ✅ **Security** - Password hashing, rate limiting, CORS, Helmet.js
- ✅ **Cloud Integration** - Image processing with Cloudinary

### Mobile Development
- ✅ **Cross-Platform Development** - iOS, Android, Web from one codebase
- ✅ **Navigation Architecture** - File-based routing with Expo Router
- ✅ **State Management** - Global state with Zustand
- ✅ **Camera Integration** - Photo capture and gallery access
- ✅ **Image Handling** - Base64 encoding for API transmission
- ✅ **Authentication Flow** - JWT token management and persistence
- ✅ **Responsive UI** - Adapts to all device sizes
- ✅ **API Integration** - Seamless backend communication

---

## 📂 Repository Structure

```
03_bookstore/
├── backend/                      # RESTful API
│   ├── README.md                # Backend documentation
│   ├── src/
│   │   ├── index.ts             # Server entry point
│   │   ├── app.ts               # Express configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/              # API endpoints
│   │   ├── models/              # MongoDB schemas
│   │   ├── middleware/          # Custom middleware
│   │   ├── config/              # Configuration files
│   │   ├── lib/                 # Utilities and libraries
│   │   └── tests/               # Test suites (TDD)
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                       # React Native App
│   ├── README.md                # Mobile documentation
│   ├── app/                     # Expo Router pages
│   │   ├── (auth)/              # Authentication screens
│   │   └── (tabs)/              # Main app screens
│   ├── components/              # Reusable components
│   ├── store/                   # Zustand state store
│   ├── constants/               # Configuration constants
│   ├── assets/                  # Images, fonts, styles
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                    # This file
```

---

## 🛠️ Tech Stack Overview

### Backend
```
Node.js / Express.js
├── TypeScript
├── MongoDB + Mongoose
├── JWT Authentication
├── Jest Testing
├── Swagger/OpenAPI
└── Cloudinary API
```

### Mobile
```
React Native / Expo
├── TypeScript
├── Expo Router
├── Zustand (State)
├── AsyncStorage (Persistence)
├── Expo Libraries
│   ├── expo-image-picker
│   ├── expo-file-system
│   └── expo-image
└── React Navigation
```

---

## 🎓 Learning Outcomes

### Backend
- Understanding **TDD methodology** and its benefits
- Building scalable RESTful APIs
- Implementing secure authentication
- Database design and optimization
- Professional API documentation
- Comprehensive testing practices

### Mobile
- Cross-platform mobile development with Expo
- **Camera and image handling** (milestone achievement!)
- Navigation architecture for complex apps
- State management patterns
- Async operations and API integration
- Responsive UI design

---

## 📡 API Routes

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Books
- `POST /books` - Create book recommendation
- `GET /books` - Browse all books
- `GET /books/user` - Your books
- `DELETE /books/:id` - Delete book

> See [backend/README.md](backend/README.md) for complete API documentation.

---

## 🚀 How to Use This Project

### For Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp sample-env.env .env  # Configure environment variables
   npm run dev
   ```
   - Server runs on `http://localhost:5000`
   - API docs available at `http://localhost:5000/api-docs`

2. **Mobile Setup** (in new terminal)
   ```bash
   cd mobile
   npm install
   npm start
   ```
   - Scan QR code with Expo Go app
   - Or run on iOS/Android emulator

3. **Testing Backend**
   ```bash
   cd backend
   npm test
   ```

### For Learning

1. **Study TDD Approach**
   - Check `backend/src/tests/` for test examples
   - See how tests are written before implementation

2. **Understand Mobile Architecture**
   - Review `mobile/app/` for Expo Router setup
   - Check `mobile/store/authStore.ts` for state management
   - See image handling in `mobile/app/(tabs)/create.tsx`

3. **API Integration**
   - Mobile makes requests to backend
   - JWT tokens stored in AsyncStorage
   - Images sent as Base64 strings

---

## 🎯 For Just Enjoying & Testing

### Quick Testing with Release Build

If you want to test the app without setting up the backend yourself:

```bash
# Use the prebuilt release/demo version
# Available for 3 months of live testing
eas build --platform ios
# or
eas build --platform android
```

**⚠️ Important:** The demo/release version is hosted for **3 months only**. After that period:
- You must deploy the backend yourself
- Build and release the mobile app using your own configuration
- Update API URLs to point to your backend

### Deployment Options

**Backend Deployment:**
- Heroku, Railway, or Render (free tier available)
- AWS, DigitalOcean, or Linode (paid options)
- Ensure MongoDB is set up (MongoDB Atlas for free tier)

**Mobile App Deployment:**
- iOS: TestFlight or App Store
- Android: Google Play Store or direct APK distribution
- Web: Vercel, Netlify, or any static host

---

## 📖 Documentation

Each component has its own detailed README:

- **[backend/README.md](backend/README.md)** - Backend architecture, TDD approach, API routes, setup
- **[mobile/README.md](mobile/README.md)** - Mobile app features, camera integration, Expo usage

---

## 🔐 Security Features

✅ JWT-based authentication
✅ Password hashing with Bcryptjs
✅ HTTP security headers (Helmet.js)
✅ Rate limiting to prevent abuse
✅ CORS properly configured
✅ Environment variables for sensitive data
✅ Base64 image encoding for API transmission

---

## ✨ Key Features

### For Users
- 📝 Create and share book recommendations
- ⭐ Rate books from 1-5 stars
- 📸 Add cover images from camera or gallery
- 👥 Browse community recommendations
- 🔐 Secure authentication
- 👤 Personal profile management

### For Developers
- 🧪 TDD architecture with full test coverage
- 📚 Interactive API documentation (Swagger + ReDoc)
- 🎨 Clean code with TypeScript
- 🔒 Production-ready security
- 📱 Cross-platform mobile compatibility
- ☁️ Cloud image storage

---

## 📊 Performance & Best Practices

### Backend
- Pagination for large datasets
- Efficient MongoDB queries
- Request rate limiting
- Error boundary middleware
- Comprehensive logging

### Mobile
- Optimized image rendering with `expo-image`
- Efficient list rendering with FlatList
- Lazy loading and pagination
- Memoized components
- Async/await for clean code

---

## 🤝 Contributing

This is a bootcamp learning project. The codebase is structured to be:
- Easy to understand for learners
- Well-documented with comments
- Following industry best practices
- Suitable for portfolio demonstration

Feel free to fork and use as a reference for your own projects!

---

## 📝 Project Information

| Aspect | Details |
|--------|---------|
| **Status** | ✅ Complete & Functional |
| **Backend** | TDD-driven, fully tested |
| **Mobile** | Cross-platform (iOS/Android/Web) |
| **Demo Duration** | 3 months (if using release build) |
| **License** | Personal Learning Project |

---

## 🚀 Next Steps After Setup

1. ✅ Install backend and mobile dependencies
2. ✅ Configure environment variables
3. ✅ Start the backend server
4. ✅ Launch the mobile app
5. ✅ Create an account in the mobile app
6. ✅ Try adding a book recommendation with a photo
7. ✅ Browse other users' recommendations
8. ✅ Check out the API documentation at `/api-docs`

---

## 🎬 Quick Commands Reference

```bash
# Backend Commands
cd backend
npm install              # Install dependencies
npm run dev              # Development server
npm test                 # Run tests
npm run build            # Build TypeScript

# Mobile Commands
cd ../mobile
npm install              # Install dependencies
npm start                # Start Expo dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run in web browser
```

---

## ⚡ Architecture Highlights

### Backend Architecture
```
Request → Express Router → Middleware → Controller → Model → MongoDB
                ↓
            Swagger Docs
            Error Handler
            Rate Limiter
            JWT Auth
```

### Mobile Architecture
```
User Interface (Screens) → Zustand Store → API Service → Backend
                           ↓
                      AsyncStorage (Persistence)
                      Image Picker
                      File System
```

---

## 📞 Support & Resources

- **Expo Documentation**: https://docs.expo.dev
- **Express.js Guide**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **React Native**: https://reactnative.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

---

## 🎉 Summary

This full-stack project demonstrates:
- Professional backend architecture with TDD
- Modern mobile app development with Expo
- Complete authentication flow
- Cloud integration for image storage
- Professional API documentation
- Cross-platform compatibility

Perfect for portfolio, learning, or as a foundation for a real application!

---

**Built with ❤️ as a comprehensive bootcamp project showcasing modern full-stack development.**

**Remember:** Each folder contains its own README with detailed setup and usage instructions. Start there for specific guidance!
