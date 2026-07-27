# RetailPro – React Frontend

A modern retail billing & inventory management system frontend built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router DOM**.

## Project Structure

```
retailpro/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx   # Sidebar + Topbar wrapper
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── Topbar.jsx            # Top navigation bar
│   │   │   └── PublicNavbar.jsx      # Navbar for public pages
│   │   └── ui/
│   │       └── index.jsx             # Reusable UI components
│   ├── context/
│   │   └── AuthContext.jsx           # Auth state + login/register/logout
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── BillingPage.jsx
│   │   └── InvoicesPage.jsx
│   ├── services/
│   │   └── api.js                    # Axios instance with JWT interceptor
│   ├── App.jsx                       # Router + protected routes
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Setup & Run

### Prerequisites

- Java 21
- Spring Boot backend running at `http://localhost:8080`

### Install & Start

```bash
cd retailpro
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## Authentication

- JWT token stored in `localStorage`
- Axios interceptor adds `Authorization: Bearer <token>` to all API calls
- Automatic redirect to `/login` on 401 responses
- Role-based: `ADMIN` and `STAFF` supported

## 📄 Pages

| Route         | Page            | Auth Required               |
| ------------- | --------------- | --------------------------- |
| `/`           | Home            | No                          |
| `/about`      | About           | No                          |
| `/contact`    | Contact         | No                          |
| `/login`      | Login           | No (redirects if logged in) |
| `/register`   | Register        | No (redirects if logged in) |
| `/dashboard`  | Dashboard       | Yes                         |
| `/categories` | Categories      | Yes                         |
| `/products`   | Products        | Yes                         |
| `/billing`    | Billing (POS)   | Yes                         |
| `/invoices`   | Invoice History | Yes                         |

## Design System

- **Font**: Plus Jakarta Sans
- **Sidebar**: `bg-slate-800`
- **Primary**: `bg-blue-600`
- **Background**: `bg-slate-50`
- **Cards**: `bg-white` with `border-slate-200` and `shadow-sm`
- **Success**: Green variants
- **Danger**: Red variants

## API Base URL

All API calls go to: `http://localhost:8080/api`

To change this, update `src/services/api.js`.
