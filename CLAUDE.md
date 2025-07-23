# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean Electric Power Corporation (KEPCO) Power Management Department AI Study Club web application built with Next.js 15 and Supabase. The application is entirely in Korean and serves as a community platform for KEPCO employees studying generative AI.

## Key Commands

```bash
# Development
npm run dev         # Start development server with Turbopack

# Build & Production
npm run build       # Build for production
npm run start       # Start production server

# Linting
npm run lint        # Run ESLint

# Database Setup
# Execute SQL files in supabase/migrations/ folder in order:
# 1. 001_initial_schema_fixed.sql
# 2. 002_rls_policies.sql
# 3. 003_admin_user.sql (optional, for setting up admin)
```

## Architecture Overview

### Authentication & Authorization
- Uses Supabase Auth with email verification
- Middleware (`src/middleware.ts`) protects routes requiring authentication
- Two user roles: `admin` and `member`
- Admin email: `jaajung@naver.com` (hardcoded in migrations)

### Database Schema
- **profiles**: User profiles linked to auth.users (with email_verified flag)
- **posts**: Board posts with categories (notice, study, free, photo)
- **comments**: Comments on posts
- **files**: File attachments for posts
- **events**: Calendar events
- **organization**: Organization hierarchy structure

Note: Profiles are only created after email verification (migration 004)

### Page Structure
- `/(auth)/*`: Public authentication pages (login, signup)
- `/(main)/*`: Protected pages with main layout
- Dynamic routes use Next.js 15 Promise-based params (must await params)

### Board System
Four board categories:
- `notice`: Admin-only announcements
- `study`: Study materials with file uploads
- `free`: Free discussion board
- `photo`: Photo gallery with image previews

### Key Technical Decisions
1. **Next.js 15 with App Router**: Uses new Promise-based params in dynamic routes
2. **Supabase Client/Server Split**: 
   - `lib/supabase/client.ts` for client components
   - `lib/supabase/server.ts` for server components
3. **Row Level Security (RLS)**: All database access controlled by RLS policies
4. **File Storage**: Separate buckets for `files` and `photos` in Supabase Storage

### Component Architecture
- **UI Components**: Using shadcn/ui with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Server components fetch data, client components handle interactions
- **Styling**: Tailwind CSS v4 with glass morphism effects

### Important Patterns
1. **Profile Creation**: Automatic via trigger when user signs up
2. **File Uploads**: Client-side upload to Supabase Storage, then reference in database
3. **Dynamic Data**: Recent activities on homepage fetch real posts/events/members
4. **Mobile Navigation**: Separate mobile nav component with bottom navigation

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

### Common Issues & Solutions
1. **params Promise Error**: In Next.js 15, dynamic route params are Promises - use `const { param } = await params`
2. **RLS Errors**: Check if user has proper role or if RLS policies need updating
3. **Storage Upload Errors**: Ensure buckets exist and storage policies are applied

### Korean Language Considerations
- All UI text is in Korean
- Date formatting uses Korean locale (`ko-KR`)
- Department placeholder: "전력관리처 전자제어부"
- Organization name: "한국전력공사 전력관리처 생성형 AI 학습동아리"