# 📚 Library Management System - Frontend

A modern, responsive frontend application for the Library Management System built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 Modern UI/UX
- Beautiful Landing Page with gradient backgrounds and smooth animations
- Responsive Design - works on desktop, tablet, and mobile
- Interactive Components - modals, real-time search, dynamic filtering
- Tailwind CSS Styling for rapid development

### 🔐 Authentication
- JWT-based Authentication with auto token refresh
- Protected Routes with route guards
- User Registration and login

### 📖 Book Management
- Advanced Search by title, author, ISBN
- Category and Status Filtering
- Book Details Modal with comprehensive information
- Real-time Availability tracking

### 📝 Transaction Management
- Active Transactions view
- Overdue Tracking with fine calculations
- Transaction History
- Staff Features for issuing and returning books

### 🗓️ Reservation System
- Book Reservations when unavailable
- Reservation Status tracking
- Expiry Tracking and quick cancellation

### 👤 User Profile
- Profile Management and editing
- Activity Statistics
- Digital Library Card
- Borrowing Limits display

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

Edit .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## 📁 Project Structure

```
library-frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── books/        # Book catalog
│   │   ├── transactions/ # Transactions
│   │   ├── reservations/ # Reservations
│   │   └── profile/      # User profile
│   ├── login/            # Login page
│   ├── register/         # Registration
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                 # Utilities
│   ├── api.ts          # API services
│   ├── store.ts        # State management
│   └── utils.ts        # Helper functions
└── public/             # Static assets
```

## 🔌 API Integration

### Authentication Endpoints
- POST /auth/login/ - User login
- POST /auth/refresh/ - Refresh token
- GET /users/me/ - Get current user

### Book Endpoints
- GET /books/ - List books
- GET /books/available/ - Available books
- GET /books/statistics/ - Statistics

### Transaction Endpoints
- GET /transactions/active/ - Active transactions
- GET /transactions/overdue/ - Overdue transactions
- POST /transactions/issue_book/ - Issue book (staff)
- POST /transactions/return_book/ - Return book (staff)

### Reservation Endpoints
- GET /reservations/ - List reservations
- POST /reservations/ - Create reservation
- POST /reservations/{id}/cancel/ - Cancel

## 🎨 Design System

### Colors
- Primary: Blue (#0ea5e9)
- Secondary: Purple (#d946ef)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)

### Components
- Buttons: Primary, Secondary, Outline
- Cards: Elevated with hover effects
- Badges: Status indicators
- Inputs: Styled with icons
- Modals: Centered dialogs

## 📦 Technologies

- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Axios - HTTP client
- Zustand - State management
- React Icons - Icon library
- date-fns - Date utilities

## 🔒 Authentication Flow

1. User logs in with credentials
2. Backend returns JWT tokens
3. Tokens stored in localStorage
4. Access token sent with each request
5. Auto refresh on token expiry
6. Redirect to login if refresh fails

## 🎯 User Roles

### Student/Member
- Browse and search books
- View own transactions/reservations
- Reserve books
- Update profile

### Staff/Admin
- All member features
- Issue/return books
- View all transactions
- Manage users
- Access analytics

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@libraryhub.com
