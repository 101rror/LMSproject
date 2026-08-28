# CPS Academy frontend

Next.js App Router frontend for CPS Academy, a competitive-programming and problem-solving learning platform backed by Strapi.

## Installation

```bash
cd frontend
npm install
copy .env.local.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to the Strapi server origin. The frontend appends `/api` for REST calls.

## Development

```bash
npm run dev
```

The app runs at `http://localhost:3000` unless that port is already in use.

## Project structure

- `app/`: public, auth, student, and role management routes
- `components/`: shared UI, layout, auth, courses, and management components
- `lib/api/`: centralized Strapi client plus resource modules
- `lib/auth/`: login and registration helpers
- `lib/permissions/`: frontend-only permission helpers
- `providers/`: authenticated session context
- `types/`: frontend contracts

## Roles

- **Student**: browse, enroll, study lessons, track progress, submit quizzes, and view results
- **Instructor**: manage assigned course content and view learner progress
- **Content Manager**: manage courses, lessons, quizzes, blog posts, and progress
- **Admin**: full content access plus users, role changes, and statistics

Frontend checks control navigation only. Strapi remains the security authority.

## Testing

```bash
npm run lint
npm run build
```

Manual flows:

1. Student: log in, browse a course, enroll, open a lesson, complete it, view progress, submit a quiz, and inspect results.
2. Instructor: verify own-course management and student-progress pages; confirm admin pages are unavailable.
3. Content Manager: verify course, lesson, quiz, blog, and progress pages; confirm users are unavailable.
4. Admin: verify dashboard, users, role changes, statistics, and all content pages.
5. Remove or expire the JWT and verify the app returns to login; verify API `401`, `403`, and `404` states are surfaced clearly.
