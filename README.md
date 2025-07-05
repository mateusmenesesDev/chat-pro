# ChatPro - Professional Real-Time Chat Application

A modern, real-time chat application built with the T3 Stack, featuring a beautiful UI and robust functionality.

## Features

- **Real-Time Messaging**: Instant message delivery using tRPC subscriptions
- **Authentication**: Secure login with Google OAuth via Clerk
- **Contact Management**: Add and manage contacts easily
- **Theme Support**: Toggle between light and dark modes
- **Mobile Responsive**: Optimized for all screen sizes
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Architecture

### System Overview

```mermaid
graph TD
    Client[Client - Next.js App] -->|tRPC| API[API Layer]
    API -->|Drizzle ORM| DB[(PostgreSQL)]
    API -->|SSE| Client
    Client -->|Auth| Clerk[Clerk Auth]
```

### Key Components

1. **Frontend Layer**
   - Next.js App Router for routing and SSR
   - React components organized by features
   - Jotai for lightweight state management

2. **API Layer**
   - tRPC for type-safe API communication
   - Server-Sent Events (SSE) for real-time updates
   - Protected and public procedures

3. **Data Layer**
   - PostgreSQL for reliable data storage
   - Drizzle ORM for type-safe database operations
   - Efficient schema design for chat functionality

## Major Dependencies

We leverage several key open-source packages:

- **[Clerk](https://clerk.com)**: Complete auth solution, chosen for its robust OAuth support and easy integration
- **[tRPC](https://trpc.io)**: End-to-end typesafe API, with built-in subscription support for real-time features
- **[React Query](https://tanstack.com/query)**: Powerful data synchronization, used via tRPC integration for caching and real-time updates
- **[React Hook Form](https://react-hook-form.com)**: Performance-focused form handling with minimal re-renders
- **[Zod](https://zod.dev)**: TypeScript-first schema validation for both forms and API endpoints
- **[Drizzle ORM](https://orm.drizzle.team)**: Modern TypeScript ORM for better type safety and performance
- **[Tailwind CSS](https://tailwindcss.com)**: Utility-first CSS framework for rapid UI development
- **[shadcn/ui](https://ui.shadcn.com)**: High-quality UI components built on Radix UI
- **[Jotai](https://jotai.org)**: Atomic state management for React, lighter than Redux

## Trade-offs and Decisions

1. **tRPC vs REST/GraphQL**
   - ✅ Type safety across stack
   - ✅ Built-in SSE subscriptions
   - ❌ No built-in schema documentation

2. **Clerk vs Custom Auth**
   - ✅ Rapid implementation
   - ✅ Built-in security features
   - ❌ Vendor lock-in
   - ❌ Cost implications at scale

3. **Drizzle vs Prisma**
   - ✅ Better performance
   - ✅ SQL-first approach
   - ❌ Newer, smaller community
   - ❌ Fewer features than Prisma

4. **SSE vs WebSocket**
   - ✅ Simpler implementation (server-to-client only)
   - ✅ Better HTTP/2 compatibility
   - ✅ Automatic reconnection
   - ❌ One-way communication only
   - ❌ Limited browser support for custom headers

5. **Form Handling (React Hook Form + Zod)**
   - ✅ Excellent performance with minimal re-renders
   - ✅ Type-safe form validation
   - ✅ Shared schemas between frontend and backend
   - ✅ Small bundle size
   - ❌ Learning curve for complex validations

6. **React Query via tRPC**
   - ✅ Automatic caching and revalidation
   - ✅ Built-in loading and error states
   - ✅ Seamless real-time updates integration
   - ✅ DevTools for debugging

## Setup and Development

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chat-pro.git
   cd chat-pro
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the following variables:

   ```env
   # Database (required)
   DATABASE_URL="postgresql://user:password@localhost:5432/chatpro"

   # Environment (optional, defaults to "development")
   NODE_ENV="development"

   # Clerk Authentication (required)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   CLERK_WEBHOOK_SIGNING_SECRET="whsec_..."

   # Validation (optional)
   SKIP_ENV_VALIDATION="false"
   ```

   Note: Empty strings are treated as undefined and will fail validation. All variables except NODE_ENV are required.

4. Initialize the database:

   ```bash
   ./start-database.sh
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run all tests with coverage
npm run test:coverage
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

```bash
# Manual deployment
npm run build
vercel --prod
```

### Docker Deployment

1. Build the image:

   ```bash
   docker build -t chatpro .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 chatpro
   ```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── features/           # Feature-based modules
│   ├── auth/          # Authentication logic
│   ├── chat/          # Chat functionality
│   └── contact/       # Contact management
├── server/            # Backend logic
│   ├── api/          # tRPC API routes
│   └── db/           # Database schema and config
├── common/            # Shared utilities
└── styles/           # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
