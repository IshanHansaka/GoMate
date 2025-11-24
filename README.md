# GoMate – DC Metro Transit Companion

> **Android APK:** [Download latest build](https://expo.dev/accounts/ishanhansakasilva/projects/GoMate/builds/9b01baaf-4afa-49fb-9596-50ca5ce5dc7b)

**GoMate** is a cross‑platform mobile app (Expo + React Native + TypeScript) that helps Washington D.C. Metrorail riders search stations, plan trips, view live train predictions, and save favourites – all with a fast, theme‑aware UI and robust state management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Scripts](#scripts)

---

## Features

### 🔐 Authentication & Security

- Form validation (React Hook Form + Yup)
- Persisted sessions (Secure / Async Storage + Redux Persist)
- Auth guarded routes & auto redirects

### 🔎 Station Search & Discovery

- Fast station lookup & filtering by line
- Sorted listings with optimized renders
- Nearby station finder (geolocation)

### ⏱️ Live Rail Predictions

- Real‑time “Next Train” arrivals
- Visual line color + destination indicators
- Delay / status highlighting

### 🧭 Journey Planning

- Station‑to‑station fare & time lookup
- Peak vs off‑peak fare awareness
- Accessible modal selectors

### ❤️ Favourites

- Mark stations you use often
- Local device persistence (offline ready)
- Quick access via header/icon patterns

### 🎨 Theming & UX

- Light/Dark mode with centralized theme tokens
- Reusable cards, badges, and list components
- Consistent typography & spacing system

---

## Tech Stack

| Layer      | Library / Tool                           |
| ---------- | ---------------------------------------- |
| Framework  | Expo (React Native)                      |
| Language   | TypeScript                               |
| Routing    | Expo Router (file‑based)                 |
| State      | Redux Toolkit + Persist                  |
| Data Fetch | RTK Query (WMATA + Auth)                 |
| Forms      | React Hook Form + Yup                    |
| Storage    | Async Storage / Secure Store             |
| UI         | Feather Icons + custom StyleSheet tokens |

---

## Getting Started

### Prerequisites

Ensure you have:

- Node.js ≥ 18
- npm or yarn
- Expo Go app (for physical device testing) OR emulator/simulator

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/GoMate.git
cd GoMate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
# Sign up at https://developer.wmata.com for a key
EXPO_PUBLIC_WMATA_API_KEY=your_wmata_primary_key_here
```

### 4. Run the App

```bash
npx expo start
```

Then:

- Scan the QR code with Expo Go
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web

---

## Project Structure

```
GoMate/
├── app/                      # Screens & routing (Expo Router)
│   ├── (auth)/               # Auth flow (login, register)
│   ├── (tabs)/               # Main tabs (home, incidents, profile, etc.)
│   │   ├── station/          # Dynamic station detail
│   │   └── _layout.tsx       # Tabs layout / header config
│   └── _layout.tsx           # Root layout (auth guard + providers)
├── api/                      # RTK Query slices
├── components/               # Reusable presentational components
├── features/                 # Redux slices (auth, favourites)
├── store/                    # Redux store setup
├── constants/                # Theme tokens, static maps
├── hooks/                    # Custom hooks
├── types/                    # TypeScript type definitions
├── assets/                   # Fonts & images
├── utils/                    # Utility helpers (geo, etc.)
├── package.json
└── README.md
```

---

## API Reference

### WMATA (Rail)

Endpoints used (base: `https://api.wmata.com`):

```http
GET /Rail.svc/json/jStations                  # List all stations
GET /StationPrediction.svc/json/GetPrediction/{StationCodes}  # Live arrivals
GET /Rail.svc/json/jLines                     # Line metadata
```

### DummyJSON (Auth Simulation)

```http
POST https://dummyjson.com/auth/login         # User login
```

---

## Scripts

From `package.json`:

```bash
npm run start    # Start dev server (Expo)
npm run android  # Launch on Android emulator/device
npm run ios      # Launch on iOS simulator/device
npm run web      # Run in web browser
```
