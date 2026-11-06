# MediCare - Doctor Management System

A full-stack healthcare and doctor management web application featuring doctor appointments, patient management, and video consultations.

## Project Structure

```
├── api/             # Vercel serverless function entry point
├── backend/         # Express.js REST API server & MongoDB models
│   ├── config/      # Database connection & configurations
│   ├── controllers/ # Route handlers & controllers
│   ├── models/      # Mongoose schemas (Doctor, Patient, Appointment, etc.)
│   ├── routes/      # Express API routes
│   └── utils/       # Utility functions & initial data seeders
└── frontend/        # React + Vite frontend application
    ├── public/      # Static assets (images, videos, favicon)
    └── src/         # React components, pages, hooks, and styles
```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS / Vanilla CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), CORS, Dotenv
- **Deployment**: Vercel / Cloud hosted

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev # or node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
