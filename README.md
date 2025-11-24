# 🚇 GoMate - DC Metro Transit Companion

**GoMate** is a modern, cross-platform mobile application built with **React Native (Expo)** and **TypeScript**. It serves as a comprehensive travel companion for commuters in the Washington D.C. Metropolitan Area, allowing users to search for Metrorail stations, view real-time train predictions, and track service details.

This project demonstrates professional mobile development practices, including strict type safety, centralized state management, secure authentication flows, and optimized API data fetching using the **WMATA API**.

---

## 📱 Features

### 🔐 Authentication & Security
* **Secure Login/Register:** Full authentication flow using **React Hook Form** and **Yup** validation.
* **Session Management:** User sessions are persisted securely using encrypted storage.
* **Route Protection:** Automatic redirection for unauthenticated users (Auth Guards).

### 🔎 Station Search & Discovery
* **Metro Station Finder:** Real-time search for Washington D.C. Metrorail stations.
* **Infinite Scroll:** Optimized performance with pagination to minimize API usage and render large lists efficiently.
* **Smart Filtering:** Filter stations by line color (Red, Blue, Orange, Silver, Green, Yellow).

### ⏱️ Live Rail Predictions
* **Real-Time Arrivals:** View up-to-the-minute "Next Train" predictions directly from WMATA sensors.
* **Boarding Info:** Live platform numbers, destination names, and line color indicators.
* **Status Alerts:** Visual indicators for delayed or holding trains.

### 📍 Journey Context
* **Service Details:** Tap any train to see detailed line information and destination context.
* **Visual Timeline:** Clean UI showing the train's route and service status.

### ❤️ Favourites & Persistence
* **Offline Support:** "Heart" your frequently used Metro stations (e.g., Metro Center, L'Enfant Plaza) to save them locally.
* **Redux Persist:** Favourites are stored on the device and remain available even after closing the app.

---

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/) via [Expo SDK 50+](https://expo.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **Data Fetching:** [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) (Caching, polling, error handling)
* **Forms:** [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
* **Storage:** [Redux Persist](https://github.com/rt2zz/redux-persist) + Async Storage
* **UI Components:** Custom components using standard `StyleSheet` & Feather Icons.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* Expo Go app on your physical device (Android/iOS) OR an Android Emulator/iOS Simulator.

### 1. Clone the Repository
bash
git clone [https://github.com/YOUR_USERNAME/GoMate.git](https://github.com/YOUR_USERNAME/GoMate.git)
cd GoMate

### 2. Install Dependencies
\nbash\nnpm install\n\n\n

### 3. Configure Environment Variables\nCreate a .env file in the root directory and add your WMATA API key.\n*(Note: You need a free account from the WMATA Developer Portal)\n\nenv\n# .env file\n# Sign up at developer.wmata.com to get your Primary Key\nEXPO_PUBLIC_WMATA_API_KEY=your_wmata_primary_key_here\n\n\n### 4. Run the App\nbash\nnpx expo start\n\n Scan the QR code with the Expo Go app on your phone.\n* Press a to run on Android Emulator.\n* Press i to run on iOS Simulator.\n\n## 📂 Project Structure\nThe project follows a scalable, feature-based architecture separating UI from business logic.\n\ntext\n/GoMate\n├── app/ # 📱 Screens & Routing (Expo Router)\n│ ├── (auth)/ # Login & Register screens\n│ ├── (tabs)/ # Main Tab Navigator (Home, Favourites, Profile)\n│ │ ├── station/ # Dynamic Station Board Screen\n│ │ ├── service/ # Dynamic Journey Detail Screen\n│ │ └── home.tsx # Station Search Screen\n│ └── _layout.tsx # Root Layout & Auth Guards\n│\n├── src/ # 🧠 Business Logic\n│ ├── api/ # RTK Query API Definitions\n│ │ ├── apiSlice.ts # Auth API (DummyJSON)\n│ │ └── wmataApiSlice.ts # WMATA Data API\n│ ├── components/ # Reusable UI Components (Cards, Inputs)\n│ ├── features/ # Redux Slices (Auth, Favourites)\n│ ├── store/ # Redux Store Configuration\n│ └── theme/ # Global Styles & Constants\n│\n├── assets/ # Images & Fonts\n└── .env # API Keys\n\n\n## 🔗 API Reference\nThis app uses two external APIs:\n\n1. WMATA API: Used for DC Metrorail data.\n * GET /Rail.svc/json/jStations (List all stations)\n * GET /StationPrediction.svc/json/GetPrediction/{StationCodes} (Live train arrivals)\n * GET /Rail.svc/json/jLines (Line color and information)\n\n2. DummyJSON: Used for simulating User Authentication.\n * POST /auth/login\n\n## 🤝 Contributing\nContributions are welcome! Please follow these steps:\n1. Fork the project.\n2. Create your feature branch (git checkout -b feature/AmazingFeature).\n3. Commit your changes (git commit -m 'Add some AmazingFeature').\n4. Push to the branch (git push origin feature/AmazingFeature).\n5. Open a Pull Request.\n\n## 📄 License\nDistributed under the MIT License. See LICENSE for more information.\n\n<p align="center">\n Built with ❤️ for Mobile Application Development Module\n</p>