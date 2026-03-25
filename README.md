# BookShelf 📚

A full-stack personal reading tracker and book discovery platform.

**Backend:** Django + Django REST Framework + JWT Auth  
**Frontend:** React + Vite + Tailwind CSS  
**Database:** PostgreSQL  
**External API:** Google Books API  
**Caching:** Redis (optional, falls back to local memory cache)

---

## Prerequisites

1. **Python 3.10+** — already available at `py`
2. **Node.js 18+** — for the React frontend
3. **PostgreSQL** — must be installed and running

### Install PostgreSQL (if not installed)

Download from https://www.postgresql.org/download/windows/

After installation, create the database:
```sql
-- Open pgAdmin or psql and run:
CREATE DATABASE bookshelf;
```

### (Optional) Get a Google Books API Key

1. Go to https://console.cloud.google.com/
2. Enable the **Books API**
3. Create an API key
4. Add it to `backend/.env` as `GOOGLE_BOOKS_API_KEY=<your_key>`
   
   > **Without a key**, the app still works but is limited to ~100 requests/day.

---

## Configuration

Edit `backend/.env`:
```
SECRET_KEY=django-insecure-bookshelf-secret-key-change-me-in-production
DEBUG=True

DB_NAME=bookshelf
DB_USER=postgres
DB_PASSWORD=postgres       ← change to your PostgreSQL password
DB_HOST=localhost
DB_PORT=5432

GOOGLE_BOOKS_API_KEY=YOUR_GOOGLE_BOOKS_API_KEY_HERE
REDIS_URL=redis://localhost:6379/0
```

---

## Running the App

### Option 1: Use the batch scripts (easiest)

**Step 1** — Open a terminal and run the backend:
```
run_backend.bat
```

**Step 2** — Open another terminal and run the frontend:
```
run_frontend.bat
```

Then visit **http://localhost:5173**

---

### Option 2: Manual

#### Backend
```powershell
cd backend
..\venv\Scripts\python manage.py migrate
..\venv\Scripts\python manage.py runserver
```

#### Frontend
```powershell
cd frontend
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | Public | Register new user |
| POST | `/api/auth/login/` | Public | Login → JWT tokens |
| POST | `/api/auth/token/refresh/` | Public | Refresh access token |
| GET/PUT | `/api/profile/` | JWT | View/update profile |
| GET | `/api/books/search/?q=` | Public | Search Google Books |
| GET/POST | `/api/shelf/` | JWT | List shelf / add book |
| PATCH/DELETE | `/api/shelf/<id>/` | JWT | Update / remove book |
| GET/POST | `/api/tracker/` | JWT | Reading sessions |
| GET/POST | `/api/reviews/` | GET: Public | Reviews by book |
| GET | `/api/reviews/my/` | JWT | My reviews |
| GET | `/api/discover/` | JWT | Personalized recommendations |
| GET | `/api/dashboard/` | JWT | Library summary |

---

## Project Structure

```
ojtttt02/
├── backend/
│   ├── bookshelf/          ← Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── api/                ← Main app
│   │   ├── models.py       ← User, Profile, UserBook, ReadingSession, Review
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── signals.py      ← Auto-create Profile on register
│   │   └── admin.py
│   ├── .env
│   └── manage.py
├── frontend/
│   └── src/
│       ├── api/            ← Axios instance with JWT interceptor
│       ├── components/     ← Sidebar, BookCard, StarRating, ProgressBar, Toast
│       ├── context/        ← AuthContext
│       ├── pages/          ← Login, Signup, Dashboard, Search, Shelf, BookDetail, Discover
│       ├── App.jsx
│       └── main.jsx
├── venv/                   ← Python virtual environment
├── run_backend.bat
└── run_frontend.bat
```

---

## Admin Panel

Visit `http://localhost:8000/admin/` to manage all data.

Create a superuser:
```powershell
cd backend
..\venv\Scripts\python manage.py createsuperuser
```
