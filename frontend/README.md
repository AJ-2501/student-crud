# Student CRUD - Vite React Frontend

A modern, responsive frontend for the Student Management CRUD API built with **React**, **Vite**, and **Tailwind CSS**.

## Features

- **Modal-Free UX**: Side-by-side split layout on desktop (stacked on mobile).
- **Inline Create & Edit**: Dedicated card for registering new students or updating selected students.
- **Inline Delete Confirmation**: In-place "Confirm? [Yes] [No]" prompt inside table rows without disruptive modal popups.
- **Search & Filter**: Real-time filtering by ID, full name, course, and section.
- **Vite Dev Proxy**: Pre-configured in `vite.config.js` to proxy `/cruz` to `http://localhost:8080` (no CORS headaches).
- **Feedback & Notifications**: Non-blocking alert banners for errors and successes.

## Running the Application

### 1. Ensure Spring Boot Backend is Running
From the root directory:
```bash
./mvnw spring-boot:run
```
*(Runs on `http://localhost:8080` with API at `/cruz/students`)*

### 2. Start the Frontend
From the `frontend` folder:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.
