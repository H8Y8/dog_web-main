# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Photo optimization scripts
npm run optimize-photos        # Optimize new photos
npm run optimize-all          # Optimize all photos
npm run optimize-existing     # Optimize existing photos

# Deployment preparation
npm run deploy-check          # Check deployment readiness
npm run pre-deploy           # Run checks and build
```

## Architecture Overview

This is a Next.js 14 App Router application for a Scottish Terrier kennel and training center website. The application uses:

- **Frontend**: React 18 with TypeScript, Tailwind CSS, Swiper for carousels, AOS for scroll animations
- **Backend**: Next.js API routes with Supabase as the database and authentication provider
- **File Storage**: Supabase Storage for image management
- **Deployment**: Designed for Cloudflare Pages deployment

## Project Structure

### App Router Organization
- `app/` - Next.js App Router structure
  - `api/` - API route handlers for CRUD operations
  - `admin/` - Admin dashboard pages and components
  - `components/` - Reusable React components
  - Page routes: `about/`, `contact/`, `diary/`, `environment/`, `puppies/`

### Library Organization
- `lib/` - Shared utilities and configurations
  - `api/` - API client functions
  - `hooks/` - Custom React hooks
  - `types/` - TypeScript type definitions
  - `design-system/` - Design tokens and utilities
  - Core files: `supabase.ts`, `auth.ts`, `image-utils.ts`

### Key Architecture Patterns

1. **Supabase Integration**: 
   - Main client in `lib/supabase.ts`
   - Authenticated client factory for API routes
   - Row Level Security (RLS) policies for data access

2. **API Structure**: RESTful API routes under `app/api/`
   - `members/` - Dog member management
   - `puppies/` - Puppy management  
   - `environments/` - Environment/facility management
   - `posts/` - Content management
   - Photo upload endpoints for each entity

3. **Admin System**:
   - Protected admin routes under `/admin`
   - Component-based admin interface in `app/admin/components/`
   - Authentication-gated access

4. **Photo Management**:
   - Image optimization scripts in `scripts/`
   - Supabase Storage integration
   - Browser-based image compression

## Database Schema

The application manages three main entities:
- **Members**: Dog profiles with photos
- **Puppies**: Puppy listings with photos
- **Environments**: Facility/environment showcases with photos
- **Posts**: Content/diary entries

Each entity supports photo galleries through Supabase Storage.

## Environment Configuration

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development Workflow

1. The application uses conditional navigation/footer components that hide on admin pages
2. Admin setup is handled through `lib/admin-setup.ts`
3. Image optimization is handled client-side using browser-image-compression
4. The design system uses earth tones and a gold primary color (`#e8b744`)

## Important Notes

- The codebase is bilingual (English/Traditional Chinese) with Chinese content predominant
- Responsive design with mobile-first approach using Tailwind CSS
- Uses AOS (Animate On Scroll) library for scroll animations
- Admin authentication is required for content management
- Photo uploads are processed and optimized before storage