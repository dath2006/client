# Chyrp Lite Reimagine - Frontend Client

A modern React/Next.js frontend for the reimagined Chyrp Lite blogging platform, built with TypeScript and featuring a comprehensive permissions system.

## About This Project

Chyrp Lite Reimagine is a complete modernization of the classic Chyrp Lite blogging platform. This frontend client provides:

- **Modern Admin Interface**: Clean, responsive admin dashboard for content management
- **Role-Based Permissions**: Granular permission system with support for multiple user roles
- **Real-time Content Management**: Create, edit, and manage posts, pages, comments, and users
- **Advanced Features**:
  - Categories and tags management
  - File upload system
  - Comment moderation and spam filtering
  - Webmentions support
  - Theme and module management
  - Site-wide settings configuration

## Prerequisites

Before running this project, make sure you have:

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager
- A running FastAPI backend server (for API endpoints)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd client
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure the following environment variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000  # Your FastAPI backend URL

# Database or other configurations as needed
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Key Features

### Authentication & Authorization

- Secure user authentication with NextAuth.js
- Role-based access control with granular permissions
- Site access control based on user permissions

### Admin Dashboard

- **Posts Management**: Create, edit, delete, and manage blog posts
- **Pages Management**: Static page creation and management
- **User Management**: User accounts, roles, and permissions
- **Comments System**: Comment moderation and spam filtering
- **File Uploads**: Media management and file organization
- **Categories & Tags**: Content organization system
- **Settings**: Site-wide configuration options

### Permissions System

The application includes a comprehensive permissions system with over 40 different permissions:

- Content permissions (add_posts, edit_posts, delete_posts, etc.)
- User management (add_users, edit_users, delete_users)
- System settings (change_settings, toggle_extensions)
- Content viewing (view_site, view_drafts, view_uploads)

### Technology Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── common/            # Shared components
│   └── examples/          # Example/demo components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api/               # API client and types
│   └── redux/             # Redux store configuration
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## API Integration

This frontend is designed to work with a FastAPI backend. Key API endpoints include:

- `/api/v1/settings` - Site configuration
- `/api/v1/permission` - User permissions based on role
- `/api/v1/posts` - Blog posts management
- `/api/v1/users` - User management
- `/api/v1/comments` - Comment system

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint and follows React/Next.js best practices. Make sure to run linting before committing changes.

## Deployment

### Building for Production

```bash
npm run build
```

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the Chyrp Lite ecosystem. Please refer to the main repository for licensing information.
