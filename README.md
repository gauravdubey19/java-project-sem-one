# GenInvoico

A full-stack web application for creating, customizing, and managing professional invoices.
Built with **React**, **Spring Boot**, and **MongoDB**, with user authentication via **Clerk** and image hosting through **Cloudinary**.

## 🌐 Features

- Create and customize invoices with multiple templates
- User authentication with Clerk
- Backend API with Spring Boot and MongoDB
- Invoice preview thumbnails uploaded to Cloudinary
- Download invoices as PDF (client-side rendering)
- Real-time UI with React 19 and hooks

## 🧱 Tech Stack

### Frontend

- React 18
- React Router
- Bootstrap 5
- html2canvas + jsPDF (PDF generation)
- Clerk (authentication)

### Backend

- Spring Boot (Java)
- MongoDB (NoSQL database)
- REST API for invoices (CRUD operations)

### Cloud Services

- Clerk.dev – Auth
- Cloudinary – Image uploads

## Getting Started

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

## 📝 API Endpoints (Sample)

- `GET /api/invoices` – List all invoices
- `POST /api/invoices` – Save a new invoice
- `PUT /api/invoices/{id}` – Update an invoice
- `DELETE /api/invoices/{id}` – Delete invoice

Made with ❤️ as a full-stack coding exercise by:
Pradnyesh C.
Gaurav D.
