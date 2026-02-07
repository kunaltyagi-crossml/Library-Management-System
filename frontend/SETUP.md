# 🚀 Library Management System - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Backend API** running on http://localhost:8000

## Backend Setup (Django)

1. Navigate to your backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start the server:
```bash
python manage.py runserver
```

The backend should now be running at http://localhost:8000

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
```bash
cd library-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend should now be running at http://localhost:3000

## Testing the Application

### Demo Credentials

You can create test users in Django admin or use these credentials if you've set them up:

**Staff Account:**
- Username: `staff`
- Password: `password123`

**Student Account:**
- Username: `student`
- Password: `password123`

### First Steps

1. **Visit the Landing Page**: http://localhost:3000
2. **Register**: Click "Get Started" or "Create Account"
3. **Login**: Use your credentials to sign in
4. **Explore**: Browse books, create transactions, make reservations

## Features to Test

### As a Student/Member:
- ✅ Browse the book catalog
- ✅ Search books by title, author, or ISBN
- ✅ Filter by category and status
- ✅ View book details
- ✅ Check active transactions
- ✅ Make reservations
- ✅ Update profile

### As Staff:
- ✅ All member features
- ✅ Issue books to users
- ✅ Return books
- ✅ View all transactions
- ✅ Manage overdue books
- ✅ Calculate fines

## Common Issues & Solutions

### Backend Issues

**Problem**: Port 8000 already in use
```bash
# Kill the process on port 8000
lsof -ti:8000 | xargs kill -9
# Or use a different port
python manage.py runserver 8001
```

**Problem**: Database errors
```bash
# Reset database
python manage.py flush
python manage.py migrate
```

### Frontend Issues

**Problem**: Port 3000 already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
# Or specify a different port
PORT=3001 npm run dev
```

**Problem**: API connection errors
- Ensure backend is running on http://localhost:8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

**Problem**: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Production Build

### Frontend
```bash
npm run build
npm start
```

### Backend
```bash
# Use production settings
python manage.py collectstatic
gunicorn library_backend.wsgi:application
```

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Project Structure

```
project-root/
├── backend/                  # Django backend
│   ├── api/                 # REST API
│   ├── catalog/             # Book models
│   ├── transactions/        # Transaction models
│   └── users/               # User models
└── library-frontend/        # Next.js frontend
    ├── app/                # App router pages
    ├── components/         # React components
    └── lib/               # Utilities
```

## Useful Commands

### Backend
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Load sample data
python manage.py loaddata fixtures/sample_data.json
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Next Steps

1. **Customize**: Modify colors in `tailwind.config.js`
2. **Add Features**: Extend the API and components
3. **Deploy**: Deploy to Vercel (frontend) and Railway/Heroku (backend)
4. **Test**: Add comprehensive tests
5. **Monitor**: Set up error tracking and analytics

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend logs
3. Verify environment variables
4. Ensure all dependencies are installed
5. Check that both frontend and backend are running

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

Happy coding! 🎉
