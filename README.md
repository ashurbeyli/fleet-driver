# Fleet Driver App

A cross-platform taxi park fleet driver management application built with React Native and Expo. The app supports Web, iOS, and Android platforms with a unified codebase.

## 🚀 Features

- **Cross-platform**: Runs on Web, iOS, and Android
- **Modern UI**: Clean and responsive design
- **TypeScript**: Full type safety
- **Scalable Architecture**: Well-organized project structure

## 📱 Platforms

- **Web**: React Native Web for browser compatibility
- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo

## 🛠 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Web** for web support
- **Expo** for cross-platform development

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   └── WelcomeScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── constants/         # App constants and configuration
│   └── index.ts
└── utils/            # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Web Development
```bash
npm run web
```
Opens the app in your default browser at `http://localhost:8081`

#### iOS Development
```bash
npm run ios
```
Opens the app in iOS Simulator (requires Xcode on macOS)

#### Android Development
```bash
npm run android
```
Opens the app in Android Emulator (requires Android Studio)

#### Development Server
```bash
npm start
```
Starts the Expo development server with QR code for testing on physical devices

## 🏗 Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation stack in `src/navigation/AppNavigator.tsx`
3. Update types in `src/types/index.ts` if needed

### Adding New Components

1. Create reusable components in `src/components/`
2. Export them from an index file for easy imports
3. Use TypeScript interfaces for props

### Styling

- Use StyleSheet for consistent styling
- Leverage the constants in `src/constants/index.ts` for colors, spacing, and typography
- Consider platform-specific styles using `Platform.select()`

## 📦 Build & Deploy

### Web Build
```bash
expo build:web
```

### Mobile Builds
```bash
expo build:ios
expo build:android
```

## 🔧 Configuration

The app configuration is managed in:
- `app.json` - Expo configuration
- `src/constants/index.ts` - App constants
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on all platforms
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.
