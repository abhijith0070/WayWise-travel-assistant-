# WayWise Travel Planner

## Overview

WayWise is an AI-powered travel planning platform that helps users create personalized itineraries and manage their travel experiences. The application provides comprehensive trip planning features including accommodation finder, transportation options, tourist recommendations, budget optimization, and real-time travel assistance through an AI chatbot.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui Components**: Pre-built accessible UI components using Radix UI primitives
- **Wouter Routing**: Lightweight client-side routing solution
- **TanStack Query**: Server state management for API calls and caching

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Modular Route System**: Organized API endpoints with middleware support
- **In-Memory Storage**: Current implementation uses memory-based storage with interface for future database integration
- **Request Logging**: Comprehensive API request/response logging with performance metrics

### Data Storage Solutions
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Database Schema**: Structured tables for users, trips, itineraries, and bookings
- **Migration Support**: Version-controlled database schema changes
- **Neon Database**: PostgreSQL database service integration ready

### UI/UX Design System
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Development Environment
- **Replit Integration**: Optimized for Replit development environment
- **Hot Module Replacement**: Fast development feedback with Vite HMR
- **TypeScript Configuration**: Strict type checking with path mapping
- **ESLint/Prettier**: Code quality and formatting enforcement

## External Dependencies

### UI Framework Dependencies
- **@radix-ui/***: Accessible headless UI components for complex interactions
- **class-variance-authority**: Type-safe component variant management
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library

### State Management
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation with schema support
- **react-hook-form**: Performant form handling

### Database & ORM
- **drizzle-orm**: Type-safe database ORM
- **drizzle-kit**: Database migration and schema management tools
- **@neondatabase/serverless**: Serverless PostgreSQL database driver

### Development Tools
- **vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

### Styling & Animation
- **embla-carousel-react**: Touch-friendly carousel component
- **date-fns**: Date manipulation utilities
- **clsx & tailwind-merge**: Conditional className utilities

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions