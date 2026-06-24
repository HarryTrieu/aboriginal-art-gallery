# Aboriginal Art Gallery

A full-stack web application for showcasing the work of Aboriginal Australian artists. Visitors can browse a gallery of artworks, read artist biographies, and leave comments. Administrators can manage artists, artworks, comments, and user roles through a protected dashboard.

> Built for **Deakin SIT331 – Task 5.2HD**.

---

## Tech Stack

### Backend
- **Node.js** + **Express 5** (ES modules)
- **MongoDB** + **Mongoose** for data persistence
- **Firebase Admin SDK** for authentication (verifies Firebase ID tokens)
- **Cloudinary** for image hosting/uploads
- **Multer** for multipart/form-data handling
- **Helmet**, **CORS**, **Morgan** for security and logging
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) for API docs
- **Jest** + **Supertest** for testing

### Frontend
- **React 19** + **Vite**
- **React Router v7** for routing
- **Tailwind CSS v4** for styling
- **Firebase Auth** (Google sign-in) on the client
- **Axios** for API calls

---

## Project Structure

```
aboriginal-art-gallery/
├── backend/
│   ├── seed/
│   │   └── seed.js              # Seeds 11 artists + 13 artworks
│   ├── src/
│   │   ├── app.js               # Express app entry point
│   │   ├── config/              # db, firebase, cloudinary config
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # auth (Firebase token) + roles (admin)
│   │   ├── models/              # Mongoose schemas
│   │   └── routes/              # Express routes (with Swagger annotations)
│   └── tests/                   # Jest + Supertest integration tests
└── frontend/
    └── src/
        ├── components/          # Navbar, ArtworkCard, CommentSection, etc.
        ├── context/             # AuthContext
        ├── pages/               # Gallery, ArtworkDetail, ArtistDetail, Login, AdminDashboard
        ├── services/            # axios api client
        └── firebase.js          # Firebase client config
```

---

## Data Models

| Model | Key fields |
|-------|-----------|
| **Artist** | `name`, `bio`, `tribe`, `region`, `birthYear`, `profileImageUrl` |
| **Artwork** | `title`, `description`, `imageUrl`, `medium`, `year`, `artist` (ref), `tags[]` |
| **User** | `firebaseUid`, `email`, `displayName`, `photoURL`, `role` (`user` \| `admin`) |
| **Comment** | `content`, `user` (ref), `artwork` (ref) |

---

## Authentication & Authorization

- Users sign in on the frontend with **Google via Firebase Auth**.
- The Firebase **ID token** is sent in the `Authorization: Bearer <token>` header.
- Backend middleware (`protect`) verifies the token with Firebase Admin and finds/creates a matching MongoDB `User`.
- The `requireAdmin` middleware restricts management endpoints to users with `role: admin`.
- A user's first login auto-creates their record with the default `user` role. Promote to `admin` via `PATCH /api/users/:id/role`.

---

## API Reference

Base URL: `http://localhost:5000/api`

Interactive Swagger docs are available at **`/api/docs`** when the server is running.

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users/login` | Public (token in header) | Login or register via Firebase token |
| GET | `/users/me` | Authenticated | Get the current user |
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/role` | Admin | Update a user's role |

### Artists
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/artists` | Public | List artists (paginated) |
| GET | `/artists/:id` | Public | Get an artist + their artworks |
| POST | `/artists` | Admin | Create an artist (`multipart/form-data`, `profileImage`) |
| PUT | `/artists/:id` | Admin | Update an artist |
| DELETE | `/artists/:id` | Admin | Delete an artist + their artworks & comments |

### Artworks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/artworks` | Public | List artworks (paginated, artist populated) |
| GET | `/artworks/:id` | Public | Get a single artwork with full artist details |
| POST | `/artworks` | Admin | Create an artwork (`multipart/form-data`, `image`) |
| PUT | `/artworks/:id` | Admin | Update an artwork |
| DELETE | `/artworks/:id` | Admin | Delete an artwork + its comments |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/comments/artwork/:artworkId` | Public | Get all comments for an artwork |
| POST | `/comments/artwork/:artworkId` | Authenticated | Add a comment |
| DELETE | `/comments/:id` | Author or Admin | Delete a comment |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Returns `{ status: "OK" }` |

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- A **MongoDB** database (local or Atlas)
- A **Firebase** project (for Auth)
- A **Cloudinary** account (for image uploads)

### 1. Backend setup

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aboriginal-art-gallery

# Firebase Admin (service account)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> Note: keep the `FIREBASE_PRIVATE_KEY` value wrapped in quotes; the app replaces the escaped `\n` sequences with real newlines at runtime.

Seed the database (optional but recommended — adds 11 artists and 13 artworks):

```bash
node seed/seed.js
```

Run the server:

```bash
npm run dev    # nodemon (auto-reload)
# or
npm start      # plain node
```

The API runs on `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Run the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` (the backend CORS config expects this origin in non-test mode).

---

## Testing

The backend has integration tests covering artworks, artists, and comments using Jest + Supertest.

```bash
cd backend
npm test
```

Tests run with `NODE_ENV=test`, which skips the live DB connection and relaxes CORS for the test harness.

---

## Scripts

### Backend
| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `node src/app.js` | Start the server |
| `npm run dev` | `nodemon src/app.js` | Start with auto-reload |
| `npm test` | `jest --runInBand` | Run the test suite |

### Frontend
| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start the dev server |
| `npm run build` | `vite build` | Production build |
| `npm run preview` | `vite preview` | Preview the production build |
| `npm run lint` | `eslint .` | Lint the codebase |

---

## Cultural Acknowledgement

This project showcases the work of Aboriginal Australian artists. Artist biographies and artwork descriptions in the seed data are drawn from public sources, and images use freely licensed (Wikimedia Commons / public domain) or fair-use references where noted. The application is built with respect for the cultural significance of the works depicted.
