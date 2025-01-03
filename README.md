# React Router Playground

## Authentication Flow

1. User enters their email address
2. System generates a TOTP code and magic link
3. Server console logs the user's email, the code, and the magic link. In production, this would instead send to the user's email
4. User can either:
   - Click the magic link to automatically verify
   - Enter the 6-digit code manually
5. Upon successful verification:
   - User account is created if it doesn't exist
   - Session is established
   - User is redirected to dashboard

The UI informs the user of state, such as if the code is incorrect, expired, or is accessed from another browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
SESSION_SECRET="generate-a-secure-random-string"
TOTP_SECRET="generate-a-64-character-hex-string"
```

### Generating Secure Keys

Generate a secure TOTP secret (64 character hex string):
```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

Generate a session secret:
```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/cyrusvorwald/react-router-playground.git
cd react-router-playground
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables as described above

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Database Setup

This template uses [Drizzle ORM](https://orm.drizzle.team) with PostgreSQL. The schema includes:

- Users table with email and timestamps
- Built-in migrations support
- Type-safe database queries

To modify the schema:
1. Edit `app/db/schema.ts`
2. Generate migrations:
```bash
npm run db:generate
```
3. Apply migrations:
```bash
npm run db:migrate
```

## Development

### File Structure

```
app/
├── components/     # Reusable UI components
│   ├── auth/      # Authentication-related components
│   └── ui/        # shadcn/ui components
├── constants/     # Auth error codes
├── db/           # Database configuration and schema
├── hooks/        # React hooks
├── lib/          # Utility functions
├── routes/       # Route components and handlers
└── services/     # Server functions
```