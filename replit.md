# replit.md

## Overview

This is a modern e-commerce web application built for selling squishy toys and stress relief products. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM with PostgreSQL for data management. The architecture follows a full-stack approach with shared TypeScript schemas and modern UI components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom CSS variables for theming (light/dark mode)
  - Framer Motion for animations and micro-interactions
  - Glass morphism design pattern for modern UI aesthetics
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints for products and cart management

### Component Architecture
- **Design System**: shadcn/ui components with customizations
- **Component Structure**: Atomic design principles with reusable UI components
- **Theme System**: Context-based theme provider supporting light/dark modes
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Key Components

### Database Schema (`shared/schema.ts`)
- **Products Table**: Stores product information including pricing, descriptions, images, categories, and inventory status
- **Cart Items Table**: Manages shopping cart functionality with session-based cart persistence
- **Shared Types**: TypeScript interfaces exported for both frontend and backend use

### API Endpoints (`server/routes.ts`)
- `GET /api/products` - Retrieve all products
- `GET /api/products/featured` - Get featured products for homepage
- `GET /api/products/category/:category` - Filter products by category
- `GET /api/products/:id` - Get single product details
- `GET /api/cart` - Retrieve cart items for current session
- `POST /api/cart` - Add items to cart
- `PATCH /api/cart/:id` - Update cart item quantities
- `DELETE /api/cart/:id` - Remove items from cart

### Storage Layer (`server/storage.ts`)
- **Interface**: `IStorage` defines contract for data operations
- **Implementation**: `MemStorage` provides in-memory storage with seeded sample data
- **Design Pattern**: Repository pattern for data access abstraction
- **Future-Ready**: Interface allows easy migration to database-backed storage

### UI Components
- **Product Display**: Product cards with hover effects, like buttons, and quick add-to-cart
- **Shopping Cart**: Slide-out sidebar cart with quantity management
- **Navigation**: Responsive header with mobile menu and theme toggle
- **Glass Morphism**: Custom glass card components for modern aesthetic
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

### Product Display Flow
1. Component mounts and triggers React Query
2. Query fetches data from `/api/products` endpoint
3. Storage layer returns product data (currently from memory)
4. UI components render products with loading/error states
5. User interactions trigger cart operations

### Cart Management Flow
1. User adds product to cart via ProductCard or ProductDetail
2. `useCart` hook manages cart state and mutations
3. API calls update cart in storage layer
4. React Query invalidates and refetches cart data
5. UI updates to reflect current cart state
6. Session-based persistence maintains cart across page refreshes

### Theme Management Flow
1. ThemeProvider manages theme state in React context
2. Theme preference stored in localStorage
3. CSS custom properties update based on theme selection
4. All components inherit theme-aware styling

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Libraries**: Radix UI primitives, Framer Motion for animations
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Development**: Vite, TypeScript, ESBuild for production builds

### Utility Libraries
- **Routing**: Wouter for lightweight routing
- **Forms**: React Hook Form with Zod validation resolvers
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent icon set
- **Styling Utilities**: clsx for conditional classes, tailwind-merge for class merging

## Deployment Strategy

### Development Environment
- **Replit Configuration**: Configured for Node.js 20 with auto-scaling deployment
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Port Configuration**: Development server on port 3000, production on port 80
- **Environment**: Development mode with runtime error overlay and source maps

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production
4. **Database Migration**: Drizzle Kit handles schema migrations

### Database Configuration
- **Development**: Neon Database serverless PostgreSQL
- **Connection**: Environment variable `DATABASE_URL` for database connection
- **Migrations**: Drizzle Kit manages schema migrations in `migrations/` directory
- **Schema**: Centralized schema definition in `shared/schema.ts`

### Build Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 15, 2025: Successfully migrated project from Replit Agent to standard Replit environment
  - Fixed port configuration to use port 5000 for proper Replit workflow compatibility
  - Maintained all existing functionality with proper client/server separation
  - Ensured secure architecture with no common vulnerabilities
  - All dependencies properly installed and configured
- June 15, 2025: Refactored search functionality to floating button design
  - Moved search from header navigation to floating button in bottom right corner
  - Created animated floating search button with glass morphism effects and pulsing ring animation
  - Fixed accessibility warnings in search dialog with proper titles and descriptions
  - Enhanced user experience with always-visible search access
- June 15, 2025: Implemented macOS-style search dialog animation
  - Added authentic macOS app opening animation using Framer Motion
  - Dialog starts as tiny circle at floating button position and expands with spring physics
  - Includes coordinated scale, position, and border-radius transformations
  - Enhanced with staggered product card animations for search results
  - Maintains proper accessibility while delivering premium user experience
- June 15, 2025: Enhanced search with advanced bounce effect animations
  - Implemented 3D perspective transforms with rotateX and rotateY effects
  - Added sophisticated spring physics with staggered entrance timing
  - Created dynamic shadow breathing effects and enhanced loading states
  - Developed interactive hover animations with 3D rotations
  - Built comprehensive exit animations for smooth result transitions
- June 15, 2025: Implemented comprehensive search functionality with real-time product search
  - Added searchProducts method to storage interface with fuzzy matching across names, descriptions, categories, and tags
  - Created search API endpoint at `/api/products/search` with query parameter support
  - Built SearchDialog component with debounced search, loading states, and animated results
  - Integrated search functionality into existing header with smooth modal interface
- June 15, 2025: Enhanced theme system with automatic system preference detection
  - Updated ThemeProvider to automatically detect and sync with system dark/light mode
  - Added real-time system theme change listeners for instant synchronization
  - Enhanced theme toggle to cycle through system/light/dark modes with visual indicators
  - Set default theme to "system" for automatic MacBook theme matching
  - User confirmed functionality works perfectly

## Changelog

Changelog:
- June 15, 2025. Initial setup