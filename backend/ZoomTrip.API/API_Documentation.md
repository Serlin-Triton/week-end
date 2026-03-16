# ZoomTrip API Documentation

Base URL: `http://localhost:5246` (Development) or `https://localhost:7119` (Development HTTPS)

## Authentication

### 1. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate a user and receive a JWT token.
- **Request Body**:
```json
{
  "mobileNumber": "1234567890",
  "password": "hashed_password_here"
}
```
- **Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "mobileNumber": "1234567890",
    "role": "Admin",
    "photoUrl": null
  }
}
```

### 2. Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Reset user password.
- **Request Body**:
```json
{
  "mobileNumber": "1234567890",
  "newPassword": "new_secure_password"
}
```
- **Response** (200 OK):
```json
{
  "message": "Password updated successfully."
}
```

---

## Users (Requires Admin Role)

### 1. Get All Users
- **Endpoint**: `GET /api/users`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "mobileNumber": "1234567890",
    "role": "Admin"
  }
]
```

### 2. Create User
- **Endpoint**: `POST /api/users`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "New Staff",
  "mobileNumber": "9876543210",
  "passwordHash": "staff_password",
  "role": "Staff"
}
```

---

## Cars

### 1. Get All Cars
- **Endpoint**: `GET /api/cars`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Toyota Camry",
    "carNumber": "XYZ-1234",
    "carType": "Sedan",
    "availabilityStatus": "Available",
    "imageUrl": "/images/cars/camry.jpg",
    "owner": { "id": 1, "name": "John Doe" },
    "location": { "id": 1, "name": "Downtown Hub" }
  }
]
```

### 2. Upload Car Image
- **Endpoint**: `POST /api/cars/{id}/image`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data**: `file` (Image File)
- **Response** (200 OK):
```json
{
  "imageUrl": "/images/cars/{filename}.jpg"
}
```

---

## Bookings

### 1. Create Booking
- **Endpoint**: `POST /api/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "startPointId": 1,
  "dropPointId": 2,
  "routeType": "One Way",
  "bookingAmount": 150.00,
  "status": "Pending"
}
```

### 2. Change Booking Status
- **Endpoint**: `PATCH /api/bookings/{id}/status`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "status": "Accepted"
}
```
*Note: Changing status to "Accepted" triggers a mocked email notification and marks the associated car as "Booked". Changing to "Completed" marks the car as "Available".*

---

## Dashboard

### 1. Get Dashboard Summary
- **Endpoint**: `GET /api/dashboard/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200 OK):
```json
{
  "totalCars": 15,
  "availableCars": 10,
  "carsOutside": 5,
  "monthlyBookingCount": 120,
  "weeklyBookingCount": 35,
  "totalRevenue": 4500.50
}
```
