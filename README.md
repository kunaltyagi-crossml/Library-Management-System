
# Library Management System
A full-stack web application for managing library operations built with Django REST Framework and Next.js. Features comprehensive book management, user authentication, transaction tracking, and real-time analytics.

## Project Overview
The Library Management System consists of **two main components**:

1. **Backend (Django REST Framework)**
   - User authentication with JWT tokens
   - Book catalog management with categories
   - Transaction system (issue/return books)
   - Fine calculation for overdue books
   - Reservation system
   - RESTful API with filtering and search
   
2. **Frontend (Next.js + TypeScript + Tailwind CSS)**
   - Modern, responsive UI with Tailwind CSS
   - Interactive dashboard with charts
   - Real-time statistics and analytics
   - Book browsing and search
   - Transaction management
   - User profile management

---

## 🏗️ Tech Stack

### Backend
- **Framework:** Django 4.2+
- **API:** Django REST Framework 3.14+
- **Database:** MySQL 8.0+
- **Authentication:** JWT (djangorestframework-simplejwt)
- **CORS:** django-cors-headers
- **Filtering:** django-filter
- **Environment Management:** python-dotenv

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.3
- **HTTP Client:** Axios 1.6+
- **Charts:** Chart.js + react-chartjs-2
- **Forms:** React Hook Form
- **Notifications:** react-hot-toast
- **Icons:** react-icons
- **Date Handling:** date-fns
- **State Management:** React Hooks

---

## 📋 Installation

### Prerequisites
- **Python** 3.10+
- **Node.js** 18+
- **MySQL** 8.0+
- **npm** 

### 1. Clone the Repository
```bash
git clone https://github.com/kunaltyagi-crossml/Library-Management-System.git
cd library-management-system
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter mysqlclient python-dotenv pillow
```

#### Set up environment variables
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=library_db
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306
```

#### Create MySQL database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create superuser
```bash
python manage.py createsuperuser
```

#### Start backend server
```bash
python manage.py runserver
```

Backend will be available at: **http://localhost:8000**

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
npm install
```

#### Set up environment variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Start development server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## 🚀 Usage

### 1. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

### 2. Create Test Data
1. Login to Django Admin at http://localhost:8000/admin
2. Create book categories (Fiction, Non-Fiction, Science, etc.)
3. Add books with details (title, author, ISBN, etc.)
4. Create users with different roles (Student, Staff, Faculty)

### 3. Application Workflow

#### For Students/Members:
1. **Register** → Create account at `/register`
2. **Login** → Sign in at `/login`
3. **Browse Books** → View available books at `/books`
4. **My Issues** → Track borrowed books at `/my-issues`
5. **Search** → Find books at `/search`

#### For Staff/Librarians:
1. **Dashboard** → View statistics at `/dashboard`
2. **Issue Book** → Issue books to members at `/issue`
3. **Return Book** → Process returns at `/return`
4. **Manage Books** → Add/edit books at `/books`
5. **View Transactions** → Monitor all transactions
6. **Manage Members** → Handle user accounts at `/members`

### 4. API Endpoints

#### Authentication
```bash
POST   /api/auth/login/           # Login
POST   /api/auth/refresh/         # Refresh token
POST   /api/auth/verify/          # Verify token
```

#### Books
```bash
GET    /api/books/                # List books
POST   /api/books/                # Create book
GET    /api/books/{id}/           # Get book details
PUT    /api/books/{id}/           # Update book
DELETE /api/books/{id}/           # Delete book
GET    /api/books/available/      # Available books
GET    /api/books/statistics/     # Book stats
```

#### Transactions
```bash
GET    /api/transactions/                 # List transactions
POST   /api/transactions/issue_book/      # Issue book
POST   /api/transactions/return_book/     # Return book
GET    /api/transactions/overdue/         # Overdue books
GET    /api/transactions/active/          # Active transactions
GET    /api/transactions/statistics/      # Transaction stats
```

#### Users
```bash
GET    /api/users/                # List users
POST   /api/users/                # Create user
GET    /api/users/me/             # Current user
GET    /api/users/{id}/           # User details
PUT    /api/users/{id}/           # Update user
DELETE /api/users/{id}/           # Delete user
```

---

## 📁 Project Structure

```
library-management-system/
│
├── backend/                           # Django Backend
│   ├── library_backend/              # Main project settings
│   │   ├── settings.py               # Django settings
│   │   ├── urls.py                   # URL configuration
│   │   └── wsgi.py                   # WSGI application
│   │
│   ├── users/                        # User management app
│   │   ├── models.py                 # User model
│   │   └── admin.py                  # Admin configuration
│   │
│   ├── catalog/                      # Book catalog app
│   │   ├── models.py                 # Book & Category models
│   │   └── admin.py                  # Admin configuration
│   │
│   ├── transactions/                 # Transaction management
│   │   ├── models.py                 # Transaction & Reservation models
│   │   └── admin.py                  # Admin configuration
│   │
│   ├── api/                          # REST API
│   │   ├── serializers.py           # DRF serializers
│   │   ├── views.py                  # API views
│   │   ├── urls.py                   # API URLs
│   │   ├── permissions.py            # Custom permissions
│   │   └── filters.py                # Custom filters
│   │
│   ├── manage.py                     # Django management script
│   └── requirements.txt              # Python dependencies
│
├── frontend/                          # Next.js Frontend
│   ├── app/                          # App Router pages
│   │   ├── dashboard/                # Dashboard page
│   │   ├── books/                    # Books management
│   │   ├── issue/                    # Issue book
│   │   ├── return/                   # Return book
│   │   ├── my-issues/                # User's books
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration
│   │   ├── search/                   # Search page
│   │   ├── members/                  # Members management
│   │   ├── settings/                 # Settings
│   │   └── help/                     # Help page
│   │
│   ├── lib/                          # Shared library
│   │   ├── components/               # React components
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── Header.tsx           # Top header
│   │   │   └── StatCard.tsx         # Stats card
│   │   ├── utils/                    # Utilities
│   │   │   ├── api.ts               # Axios client
│   │   │   ├── auth.ts              # Auth service
│   │   │   └── services.ts          # API services
│   │   └── types.ts                  # TypeScript types
│   │
│   ├── public/                       # Static assets
│   ├── next.config.js                # Next.js config
│   ├── tailwind.config.js            # Tailwind config
│   ├── tsconfig.json                 # TypeScript config
│   └── package.json                  # Node dependencies
│
├── README.md                          # This file
├── SETUP_GUIDE.md                     # Detailed setup guide
└── .gitignore                         # Git ignore rules
```

---

## 🎯 Key Features

### User Management
- ✅ Multiple user roles (Student, Faculty, Staff, External)
- ✅ JWT-based authentication
- ✅ User profile management
- ✅ Library card number assignment
- ✅ Membership tracking

### Book Management
- ✅ Comprehensive book catalog
- ✅ Category organization
- ✅ ISBN tracking (13 & 10 digit)
- ✅ Multiple copies tracking
- ✅ Book status management (Available, Issued, Reserved, etc.)
- ✅ Advanced search and filtering

### Transaction System
- ✅ Book issue/return workflow
- ✅ Due date tracking
- ✅ Automatic fine calculation
- ✅ Overdue book alerts
- ✅ Transaction history
- ✅ Staff assignment tracking

### Reservation System
- ✅ Book reservation queue
- ✅ Expiry date management
- ✅ Reservation notifications
- ✅ Cancellation support

### Dashboard & Analytics
- ✅ Real-time statistics
- ✅ Interactive charts
- ✅ Borrowing trends
- ✅ Overdue history
- ✅ Fine tracking
- ✅ Member activity

### UI/UX Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light mode ready
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

---

## 🔧 Configuration

### Backend Configuration

#### Django Settings
```python
# library_backend/settings.py

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'library_db'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### Frontend Configuration

#### Next.js Config
```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
}
```

#### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
    },
  },
}
```

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 📊 Database Schema

### Users Table
- Custom user model extending Django's AbstractUser
- Fields: user_type, status, library_card_number, max_books_allowed, etc.

### Books Table
- Comprehensive book information
- Fields: title, isbn, author, category, status, copies, etc.

### Transactions Table
- Book issue/return records
- Fields: user, book, issue_date, due_date, return_date, fine, etc.

### Reservations Table
- Book reservation system
- Fields: user, book, reservation_date, expiry_date, status

### Categories Table
- Book categorization
- Fields: name, description

---

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Error
**Problem:** Frontend can't connect to backend

**Solution:**
```python
# backend/library_backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### 2. Database Connection Error
**Problem:** Can't connect to MySQL

**Solution:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Create database: `CREATE DATABASE library_db;`

#### 3. Module Not Found (Frontend)
**Problem:** Import errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. Migration Errors
**Problem:** Database migrations fail

**Solution:**
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

---

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in settings
2. Configure `ALLOWED_HOSTS`
3. Use production database
4. Collect static files: `python manage.py collectstatic`
5. Use Gunicorn/uWSGI
6. Set up Nginx/Apache

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Update `NEXT_PUBLIC_API_URL` to production backend

---

## 📚 Learning Outcomes

### Backend Skills
- ✅ Django REST Framework API development
- ✅ JWT authentication implementation
- ✅ Database modeling and relationships
- ✅ Custom permissions and filters
- ✅ Transaction management
- ✅ Fine calculation logic

### Frontend Skills
- ✅ Next.js App Router architecture
- ✅ TypeScript for type safety
- ✅ Tailwind CSS responsive design
- ✅ Axios API integration
- ✅ Chart.js data visualization
- ✅ Form handling and validation
- ✅ State management with React Hooks

### Full-Stack Integration
- ✅ RESTful API design patterns
- ✅ Authentication flow (JWT)
- ✅ CORS configuration
- ✅ Error handling strategies
- ✅ Real-time data synchronization

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request
---

## 🙏 Acknowledgments

- Django REST Framework documentation
- Next.js documentation
- Tailwind CSS community
- Chart.js team
- Open source contributors

---




