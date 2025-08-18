# Balance Botanica - SvelteKit CBD Shop Project Guide

This Markdown file serves as a comprehensive guide to our **Balance Botanica** SvelteKit-based CBD e-commerce project. It's designed for AI models operating in CLI mode to quickly understand, replicate, and contribute to the project. The project is a modern CBD shop using SvelteKit for the frontend, Drizzle ORM with SQLite for the database, and includes authentication, internationalization, and a clean architecture.

## Project Overview

- **Type**: Modern CBD e-commerce site with authentication and internationalization
- **Frontend**: SvelteKit 2.x with TypeScript and Tailwind CSS v4
- **Database**: SQLite with Drizzle ORM (not PocketBase as previously documented)
- **Authentication**: Lucia auth system with secure password hashing (Argon2)
- **Internationalization**: Paraglide for English (en) and Ukrainian (uk-UA)
- **Styling**: Tailwind CSS v4 with typography and forms plugins
- **Architecture**: Clean separation with server/client layers
- **Package Manager**: npm (not yarn as previously documented)

## Current Project Status

✅ **Phase 1 COMPLETE**:

- 78 SVG assets extracted from Figma design
- Ukrainian (default) + English internationalization setup
- Complete translation files with all content from Figma
- Project foundation ready for Phase 2: UI implementation

## Project Structure

```
balance_botanica/
├── src/
│   ├── app.d.ts              # TypeScript declarations
│   ├── app.html              # Main HTML template
│   ├── app.css               # Global CSS
│   ├── hooks.server.ts       # Server-side hooks (auth, etc.)
│   ├── hooks.ts              # Client-side hooks
│   ├── lib/
│   │   ├── assets/           # Static assets (favicon.svg)
│   │   ├── index.ts          # Main exports
│   │   ├── paraglide/        # Internationalization setup
│   │   └── server/           # Server-side logic
│   │       ├── auth.ts       # Lucia authentication system
│   │       └── db/           # Database layer
│   │           ├── index.ts  # Database connection
│   │           └── schema.ts # Drizzle ORM schema
│   └── routes/               # File-based routing
│       ├── +layout.svelte    # Global layout
│       ├── +page.svelte      # Home page
│       └── demo/             # Demo routes
│           ├── +page.svelte  # Demo landing
│           ├── lucia/        # Authentication demo
│           │   ├── +page.svelte
│           │   └── login/    # Login/Register demo
│           │       ├── +page.server.ts  # Server logic
│           │       └── +page.svelte     # Login form UI
│           └── paraglide/    # i18n demo
│               └── +page.svelte
├── messages/                  # Internationalization files
│   ├── en.json               # English translations
│   └── uk-ua.json            # Ukrainian translations
├── static/                    # Static assets
│   └── robots.txt
├── drizzle.config.ts          # Drizzle ORM configuration
├── svelte.config.js           # SvelteKit configuration
├── vite.config.ts             # Vite build configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # ESLint configuration
├── .prettierrc                # Prettier configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## Key Technologies & Dependencies

### Core Framework

- **SvelteKit 2.x**: Modern full-stack framework
- **TypeScript**: Type-safe development
- **Vite 7.x**: Build tool and dev server

### Database & ORM

- **Drizzle ORM**: Type-safe SQL query builder
- **SQLite**: Lightweight database (better-sqlite3)
- **Database Schema**: Users and sessions tables

### Authentication

- **Lucia**: Modern authentication library
- **Argon2**: Secure password hashing
- **Session Management**: Secure cookie-based sessions

### Styling & UI

- **Tailwind CSS v4**: Utility-first CSS framework
- **Typography Plugin**: Rich text styling
- **Forms Plugin**: Form element styling

### Internationalization

- **Paraglide**: High-performance i18n library
- **Languages**: English (en) and Ukrainian (uk-UA)
- **Message Format**: JSON-based translations

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Svelte Check**: Type checking

## Database Schema

The current schema includes:

```typescript
// User table for authentication
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

// Session table for authentication
export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});
```

## Authentication System

The project uses Lucia for authentication with:

- **Secure password hashing** using Argon2
- **Session management** with secure cookies
- **User registration and login** functionality
- **Demo pages** for testing authentication

### Key Authentication Files

- `src/lib/server/auth.ts`: Authentication logic
- `src/routes/demo/lucia/login/+page.server.ts`: Server-side auth handling
- `src/routes/demo/lucia/login/+page.svelte`: Login/register UI

## Internationalization Setup

Internationalization is configured with:

- **Default language**: Ukrainian (uk-UA)
- **Secondary language**: English (en)
- **Message files**: JSON format in `messages/` directory
- **Paraglide integration**: High-performance i18n

## Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database operations
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Code quality
npm run check            # Type checking
npm run format           # Format code with Prettier
npm run lint             # Lint code with ESLint
```

## Getting Started

### Prerequisites

- Node.js 20.19.0+ or 22.12.0+ or 24.0.0+
- npm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd balance_botanica

# Install dependencies
npm install

# Set up environment variables
# Create .env file with DATABASE_URL=file:./local.db

# Initialize database
npm run db:push

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=file:./local.db
```

## Database Operations

### Initial Setup

```bash
# Create database and tables
npm run db:push
```

### Development

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

## Architecture Patterns

### File-Based Routing

- **`+page.svelte`**: UI components (client-side)
- **`+page.server.ts`**: Server logic (server-side)
- **`+layout.svelte`**: Global layout wrapper

### Server/Client Separation

- **`src/lib/server/`**: Server-only code (database, auth)
- **`src/lib/`**: Shared code (assets, utilities)
- **`src/routes/`**: Page components and server logic

### Authentication Flow

1. User submits login/register form
2. `+page.server.ts` handles form submission
3. Server validates credentials and creates session
4. User is redirected to authenticated area

## Next Steps (Phase 2)

The project is ready for UI implementation:

1. **Create main pages**: Home, products, cart, checkout
2. **Implement product management**: CRUD operations
3. **Add shopping cart functionality**: Svelte stores
4. **Integrate payment processing**: Stripe or alternatives
5. **Mobile responsiveness**: Tailwind responsive classes
6. **SEO optimization**: Meta tags, structured data

## Deployment

### Build for Production

```bash
npm run build
npm run preview
```

### Deployment Options

- **Vercel**: Automatic deployment with SvelteKit adapter-auto
- **Netlify**: Static site generation
- **Self-hosted**: Node.js server with PM2

## Troubleshooting

### Common Issues

1. **Node.js version**: Ensure you're using compatible version (20.19.0+, 22.12.0+, or 24.0.0+)
2. **Database connection**: Check DATABASE_URL environment variable
3. **Dependencies**: Clear npm cache and reinstall if needed

### Development Tips

- Use `npm run check` for TypeScript validation
- Check console for build errors
- Use Drizzle Studio for database inspection

## Contributing

1. Follow the established project structure
2. Use TypeScript for all new code
3. Follow SvelteKit best practices
4. Test authentication flows thoroughly
5. Maintain internationalization support

This guide provides a complete overview of the Balance Botanica project structure and can be used by AI models to understand and contribute to the codebase effectively.
