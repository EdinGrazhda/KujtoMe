# KujtoMe

> **"Asnjë fëmijë mos të humbet nga kujdesi."**  
> A digital health platform connecting parents and doctors to track children's vaccinations, preventive checkups, and health records.

KujtoMe is a full-stack web application built with **Laravel 13** and **React 19 + Inertia.js**. It provides a digital health booklet for children, automated vaccine reminders, and a role-based workflow for parents, doctors, and administrators.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Roles & Permissions](#roles--permissions)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Routes Overview](#routes-overview)

---

## Features

- **Digital Health Booklet** — Complete vaccination and development history per child
- **Vaccination Scheduling** — Parents book appointments; doctors confirm and manage them
- **Vaccine Reminder Emails** — Automated reminders sent before scheduled vaccinations
- **Role-Based Access Control** — Admin, Doctor, Parent, and Child roles with 21 granular permissions (Spatie Laravel Permission)
- **Passkey & Two-Factor Auth** — WebAuthn passkeys + TOTP 2FA via Laravel Fortify
- **Risk Detection** — Early identification of delayed checkups and missed vaccines
- **Parent–Doctor Communication** — Doctor-initiated contact and appointment confirmation flow
- **Admin Panel** — Full user, role, and permission management

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| PHP | ^8.3 | Runtime |
| Laravel | ^13.7 | Application framework |
| Inertia.js (Laravel) | ^3.0 | SPA adapter (no API layer needed for web views) |
| Laravel Fortify | ^1.37.2 | Authentication (login, register, 2FA, passkeys, password reset) |
| Laravel Sanctum | ^4.0 | API token authentication |
| Spatie Laravel Permission | ^7.4 | Roles & permissions (RBAC) |
| Laravel Wayfinder | ^0.1.14 | Type-safe route discovery for frontend |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI framework |
| TypeScript | ^5.7.2 | Type safety |
| Vite | ^8.0.0 | Build tool |
| Tailwind CSS | ^4.0.0 | Utility-first styling |
| @inertiajs/react | ^3.0.0 | Inertia React adapter |
| Radix UI | latest | Headless accessible components |
| Lucide React | ^0.475.0 | Icon library |
| Sonner | ^2.0.0 | Toast notifications |
| Axios | ^1.16.1 | HTTP client |

### Testing & Quality
| Tool | Purpose |
|---|---|
| Pest ^4.7 | PHP testing framework |
| Laravel Pint | PHP code style (PSR-12) |
| ESLint 9 + Prettier | TypeScript/React linting & formatting |

---

## Roles & Permissions

KujtoMe uses **Spatie Laravel Permission** with four roles and 21 granular permissions.

| Role | Description |
|---|---|
| **Admin** | Full access — manages users, roles, permissions, and all resources |
| **Doctor** | Views children & parents; manages and updates confirmation/vaccination records |
| **Parent** | Creates and views their own children's records; books vaccination appointments |
| **Child** | View-only access to their own records and confirmations |

### Permission Matrix

| Resource | Admin | Doctor | Parent | Child |
|---|---|---|---|---|
| Children | View, Create, Update, Delete | View | View, Create, Update | View |
| Doctors | View, Create, Update, Delete | — | — | — |
| Parents | View, Create, Update, Delete | View | — | — |
| Vaccines | View, Create, Update, Delete | View | View | — |
| Confirmations | View, Create, Update, Delete | View, Update | View, Create | View |

---

## Project Structure

```
├── app/
│   ├── Actions/Fortify/          # Custom registration & password reset logic
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/              # RESTful API controllers (CRUD + policy auth)
│   │   │   └── Settings/         # Profile & security settings controllers
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Mail/
│   │   └── VaccineReminderMail.php
│   ├── Models/
│   │   ├── User.php              # Auth + HasRoles + PasskeyAuthenticatable
│   │   ├── Children.php
│   │   ├── Parents.php
│   │   ├── doctor.php
│   │   ├── Vaccine.php
│   │   └── Confirmation.php
│   ├── Policies/                 # One policy per model (permission-based)
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── FortifyServiceProvider.php
├── database/
│   ├── migrations/               # 25+ migrations
│   ├── seeders/                  # Vaccines, Children, Doctors, Parents, Roles
│   └── factories/
├── resources/
│   ├── js/
│   │   └── pages/                # Inertia page components (React/TSX)
│   └── css/
├── routes/
│   ├── web.php                   # Web routes with Inertia rendering
│   ├── api.php                   # REST API routes (Sanctum-protected)
│   └── settings.php              # Profile & security settings routes
└── tests/
    ├── Feature/
    └── Unit/
```

---

## Database Schema

### Core Tables

| Table | Key Columns |
|---|---|
| `users` | id, name, email, password, two_factor_secret, two_factor_confirmed_at |
| `children` | id, user_id, name, surname, date_of_birth, gender, personal_number, blood_type, allergies, chronic_diseases |
| `parent` | id, user_id, name, surname, email, phone_number, personal_number, child_id |
| `doctor` | id, user_id, name, surname, email, phone_number, child_id, status |
| `vaccine` | id, code, name, type, protectsAgainst, recommended_age_months, dose, vaccination_municipality, image, description |
| `confirmation` | id, parent_id, child_id, vaccine_id, doctor_id, status, appointment_date, appointment_time |
| `child_parent` | child_id, parent_id (many-to-many pivot) |
| `passkeys` | WebAuthn credentials |
| `roles`, `permissions` | Spatie RBAC tables |

### Model Relationships

```
User ──── Children (hasOne)
     ──── Parents  (hasOne)
     ──── doctor   (hasOne)

Children ──── Confirmation (hasMany)
         ──── Parents (belongsToMany via child_parent)

Parents ──── Confirmation (hasMany)
        ──── Children (belongsToMany via child_parent)

Vaccine ──── Confirmation (hasMany)

doctor  ──── Confirmation (hasMany, via doctor_id)
```

---

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer 2.x
- Node.js 20+ with pnpm
- SQLite (default) or MySQL/PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kujtome.git
cd kujtome

# Install PHP dependencies
composer install

# Install Node dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed data
php artisan migrate --seed
```

---

## Environment Setup

Key variables in `.env`:

```env
APP_NAME=KujtoMe
APP_ENV=local
APP_URL=http://localhost

# Database (SQLite by default)
DB_CONNECTION=sqlite
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=kujtome
# DB_USERNAME=root
# DB_PASSWORD=

# Mail (for vaccine reminders)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS=noreply@kujtome.al
MAIL_FROM_NAME="KujtoMe"

# Queue (for async reminder emails)
QUEUE_CONNECTION=database
```

---

## Running the App

```bash
# Start the development server (Laravel + Vite concurrently)
composer run dev

# Or start separately:
php artisan serve          # Laravel on http://localhost:8000
pnpm run dev               # Vite on http://localhost:5173

# Build for production
pnpm run build
php artisan optimize
```

### Queue Worker (for email reminders)

```bash
php artisan queue:work
```

---

## Testing

```bash
# Run all tests
php artisan test

# Run with Pest directly
./vendor/bin/pest

# Run a specific test file
./vendor/bin/pest tests/Feature/ExampleTest.php

# Code style check
./vendor/bin/pint --test

# Auto-fix code style
./vendor/bin/pint
```

---

## API Reference

All API endpoints are prefixed with `/api` and require **Sanctum authentication** (`Authorization: Bearer {token}`).

### Children

| Method | Endpoint | Permission Required |
|---|---|---|
| `GET` | `/api/children` | `Children_View` |
| `POST` | `/api/children` | `Children_Create` |
| `GET` | `/api/children/{id}` | `Children_View` |
| `PUT` | `/api/children/{id}` | `Children_Update` |
| `DELETE` | `/api/children/{id}` | `Children_Delete` |

Same pattern applies for: **doctors**, **parents**, **vaccines**, **confirmations**.

### Confirmations (Extra Actions)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/confirmations/{id}/remind` | Send vaccine reminder email to parent |
| `POST` | `/api/confirmations/{id}/doctor-call` | Doctor-initiated contact |

### Roles & Permissions (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roles` | List all roles |
| `POST` | `/api/roles` | Create a role |
| `GET` | `/api/roles/{id}` | Get role details |
| `PUT` | `/api/roles/{id}` | Update role & permissions |
| `DELETE` | `/api/roles/{id}` | Delete role |
| `GET` | `/api/permissions` | List all permissions |

### Users (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/{id}/roles` | Assign/revoke roles for a user |

---

## Routes Overview

### Web Routes

| Route | Page | Access |
|---|---|---|
| `GET /` | Welcome / Landing | Public |
| `GET /dashboard` | Dashboard | Auth + Verified |
| `GET /reservation` | Book appointment | `Confirmations_Create` |
| `GET /confirm/{id}` | Parent confirmation view | Auth |
| `GET /admin/children` | Children list | `Children_View` |
| `GET /admin/children/{id}/profile` | Child health record | `Children_View` |
| `GET /admin/children/{id}/timeline` | Vaccination timeline | `Children_View` |
| `GET /admin/doctors` | Doctors list | `Doctors_View` |
| `GET /admin/doctor/appointments` | Doctor's appointments | Role: `Doctor` |
| `GET /admin/vaccines` | Vaccines list | `Vaccines_View` |
| `GET /admin/confirmations` | Confirmations list | `Confirmations_View` |
| `GET /admin/roles` | Roles management | Role: `Admin` |
| `GET /admin/users` | Users management | Role: `Admin` |
| `GET /settings/profile` | Profile settings | Auth |
| `GET /settings/security` | Security & 2FA | Auth + Verified |

---

## Authentication

KujtoMe uses **Laravel Fortify** with the following features enabled:

- Email/password registration and login
- Password reset via email
- Email verification
- **Two-factor authentication (TOTP)** — QR code setup via authenticator apps
- **Passkey authentication (WebAuthn)** — Passwordless login with biometrics or hardware keys

Rate limits are enforced:
- Login: 5 attempts/minute per user
- Two-factor challenge: 5 attempts/minute
- Passkeys: 10 attempts/minute per credential

---

## Security

- **RBAC** via Spatie Laravel Permission — every API endpoint and web route is policy-protected
- **Password strength** enforcement in production (min 12 chars, mixed case, symbols, breach check via HaveIBeenPwned)
- **Destructive DB commands** disabled in production
- **Sanctum** for stateless API token authentication
- **CSRF** protection on all web routes

---

## License

This project is proprietary software. All rights reserved © 2026 KujtoMe.
