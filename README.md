# Elite Properties

A modern, responsive real estate application built with React, TypeScript, and Tailwind CSS. Features an intuitive interface for browsing properties, detailed property views with image galleries, an AI chatbot assistant, and a comprehensive favorites system.

## ✨ Features

- **Property Listings**: Browse through a curated collection of premium properties
- **Advanced Search & Filtering**: Find properties by type, price range, and location
- **Property Details**: Detailed property pages with image galleries and comprehensive information
- **Favorites System**: Save and manage your favorite properties across all pages
- **AI Chat Assistant**: Get instant help with property inquiries and broker connections
- **Broker Information**: Connect with experienced real estate professionals
- **Dark/Light Mode**: Toggle between themes for optimal viewing experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Gallery**: Multi-image property galleries with thumbnail navigation

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository** (if using version control) or navigate to the project directory:
   ```bash
   cd Elite_Properties
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run dev:mobile` - Start the development server with mobile access (accessible on local network)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
Elite_Properties/
├── public/
│   └── images/
│       ├── broker/           # Broker profile images
│       └── properties/       # Property images
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── ChatPage.tsx     # AI chat assistant
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── Navigation.tsx   # Main navigation
│   │   ├── PropertiesPage.tsx # Property listings
│   │   ├── PropertyCard.tsx # Individual property cards
│   │   ├── PropertyDetailPage.tsx # Detailed property view
│   │   └── ScrollToTop.tsx  # Auto-scroll utility
│   ├── data/
│   │   └── mockData.ts      # Sample property data
│   ├── hooks/
│   │   ├── useDarkMode.ts   # Dark mode functionality
│   │   ├── useLocalStorage.ts # Local storage utilities
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── chatBot.ts       # AI chatbot logic
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── package.json
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React & Tabler Icons
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks + Local Storage
- **Code Quality**: ESLint + TypeScript

## 📱 Key Features Overview

### Property Management
- **Property Cards**: Interactive cards with heart/favorite functionality
- **Image Galleries**: Multi-image support with thumbnail navigation
- **Property Types**: Houses, Apartments, and Land Plots
- **Status Tracking**: Available, Sold, Pending status indicators

### User Experience
- **Favorites System**: Heart icons on all property cards to save favorites
- **Toast Notifications**: User feedback for all actions
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach

### Chat Assistant
- **AI-Powered**: Intelligent responses to property inquiries
- **Property Recommendations**: Embedded property cards in chat
- **Broker Connections**: Direct links to contact real estate agents
- **Quick Actions**: Predefined buttons for common tasks

### Navigation & Layout
- **Dark Mode Toggle**: Animated theme switcher in navigation
- **Broker Information**: Responsive broker details section
- **Mobile Optimization**: Collapsible navigation and optimized layouts
- **Scroll to Top**: Automatic scroll management on page changes

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Emerald primary with gray neutrals
- **Typography**: Modern, readable font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components from shadcn/ui
- **Animations**: Subtle hover effects and transitions

## 📞 Contact & Support

For questions about the application or real estate inquiries:

**Janek Krupička** - Senior Real Estate Broker
- Phone: +1 123 456 7890
- Email: janek.krupicka@eliteproperties.com
- LinkedIn: linkedin.com/in/janekkrupicka-realtor

## 🚀 Deployment

To deploy the application:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Elite Properties.

---

**Elite Properties** - *Your gateway to premium real estate*
