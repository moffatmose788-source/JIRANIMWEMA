# BOMAENGWE WELFARE Management System

A comprehensive community welfare management platform built with React, Vite, Tailwind CSS, and Firebase.

## Project Structure

```
bomaengwe-welfare/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── __manus__/              # Manus runtime files
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx # Main dashboard layout
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Map.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx     # Firebase authentication
│   │   │   ├── DemoAuthContext.tsx # Demo mode (no Firebase)
│   │   │   └── ThemeContext.tsx    # Dark/light theme
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/
│   │   │   ├── firebase.ts         # Firebase config
│   │   │   ├── firestore.ts        # Firestore service layer
│   │   │   ├── mockData.ts         # Demo data
│   │   │   ├── i18n.ts             # Internationalization
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx     # Public landing page
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   ├── dashboard/          # Role-based dashboards
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── CommitteeDashboard.tsx
│   │   │   │   └── MemberDashboard.tsx
│   │   │   ├── members/            # Member management
│   │   │   │   ├── MembersPage.tsx
│   │   │   │   └── MemberIdCardPage.tsx
│   │   │   ├── contributions/      # Contribution tracking
│   │   │   ├── welfare/            # Welfare assistance
│   │   │   ├── meetings/           # Meeting management
│   │   │   ├── announcements/      # Announcements
│   │   │   ├── finances/           # Financial management
│   │   │   ├── reports/            # Reports & analytics
│   │   │   ├── notifications/      # Notifications
│   │   │   ├── profile/            # User profile
│   │   │   └── settings/           # Settings
│   │   ├── App.tsx                 # Main app & routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles
│   └── index.html                  # HTML template
├── server/                          # Express backend (placeholder)
├── shared/                          # Shared types & constants
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── components.json                  # shadcn/ui config
├── FIREBASE_SETUP.md                # Firebase setup guide
└── ideas.md                         # Design philosophy
```

## Key Features

### Authentication & Authorization
- **Three-tier role system**: Admin, Committee, Member
- **Demo mode**: Works without Firebase (pre-configured demo credentials)
- **Firebase integration**: Real-time authentication and data persistence
- **Protected routes**: Role-based access control

### Core Modules
1. **Member Management** — Add, edit, delete members with digital ID cards
2. **Contributions** — Track member contributions with receipts
3. **Welfare Assistance** — Request and approve welfare disbursements
4. **Meetings** — Schedule and track community meetings
5. **Announcements** — Post and manage announcements
6. **Financial Management** — Track income and expenses
7. **Reports** — Generate society reports and analytics
8. **Notifications** — In-app notification system
9. **Settings** — Firebase config, theme, language preferences

### Design Features
- **Modern Civic Fintech Aesthetic** — Deep teal (#0F766E) brand color
- **Responsive Design** — Mobile-first, works on all devices
- **Dark Mode** — Full dark mode support
- **Multi-language** — English and Kiswahili support
- **Accessibility** — WCAG compliant with keyboard navigation
- **Charts & Analytics** — Recharts for data visualization

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | React Context API |
| **Routing** | Wouter |
| **Backend** | Firebase/Firestore |
| **Charts** | Recharts |
| **Forms** | React Hook Form, Zod |
| **Notifications** | Sonner |

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Firebase project (optional, app works in demo mode without it)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Demo Credentials

The app includes demo credentials for testing (no Firebase required):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bomaengwe.org | demo123 |
| Committee | committee@bomaengwe.org | demo123 |
| Member | member@bomaengwe.org | demo123 |

## Firebase Setup

To enable real-time data persistence:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Create a Firestore database
4. In the app, go to **Settings → Firebase** and paste your Firebase config
5. See `FIREBASE_SETUP.md` for detailed instructions and security rules

## Configuration

### Environment Variables

Create a `.env.local` file (optional, for Firebase):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Theme Customization

Edit `client/src/index.css` to change:
- Primary color (currently deep teal #0F766E)
- Typography (Sora for headings, Inter for body)
- Spacing and radius tokens
- Dark mode colors

## Development Workflow

1. **Create pages** in `client/src/pages/`
2. **Share UI components** in `client/src/components/`
3. **Use contexts** for global state (auth, theme)
4. **Add utilities** to `client/src/lib/utils.ts`
5. **Keep styles** in Tailwind utilities or `index.css`

## Building & Deployment

```bash
# Build for production
pnpm build

# The output is in dist/ folder
# Deploy to any static hosting (Vercel, Netlify, etc.)
```

## Project Status

✅ **Complete Features:**
- Landing page with hero section
- Three-role authentication system
- Admin, Committee, and Member dashboards
- Member management with CRUD operations
- Digital ID cards with QR codes
- Contribution tracking and receipts
- Welfare assistance request workflow
- Meeting management
- Announcements system
- Financial management (income/expenses)
- Reports and analytics
- Notifications system
- User profile management
- Settings (Firebase config, theme, language)
- Dark mode support
- Kiswahili language support

❌ **Removed:**
- Loans module (removed per user request)

## Support & Documentation

- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Design Philosophy**: See `ideas.md`
- **Component Library**: shadcn/ui components in `client/src/components/ui/`

## License

MIT

---

**Built with ❤️ for community welfare management**
