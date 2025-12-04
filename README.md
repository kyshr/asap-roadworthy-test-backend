# ASAP Roadworthy Test Backend

Express.js TypeScript API backend with MongoDB and JWT authentication.

## Features

- ✅ Express.js with TypeScript
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Zod Schema Validation
- ✅ Security Middlewares (Helmet, CORS, Rate Limiting, XSS, HPP, Mongo Sanitize)
- ✅ Winston Logger with Daily Rotate
- ✅ Clean Architecture
- ✅ Error Handling
- ✅ Async Handler

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middlewares
├── models/          # Mongoose models
├── repositories/    # Data access layer
├── routes/          # Route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
└── validators/      # Validation middlewares
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register User

- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user account
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890", // Optional
    "password": "password123",
    "role": "user" // Optional, defaults to "user"
  }
  ```
- **Response:** `201 Created`
  - **Cookie:** `token` (httpOnly, secure, sameSite=strict)
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "role": "user"
      }
    }
  }
  ```
  **Note:** The JWT token is set as an httpOnly cookie and is not returned in the response body for security.

#### Login User

- **Endpoint:** `POST /api/auth/login`
- **Description:** Login with email or phone number
- **Request Body:**
  ```json
  {
    "email": "john@example.com", // OR
    "phoneNumber": "+1234567890", // Either email or phoneNumber required
    "password": "password123"
  }
  ```
- **Response:** `200 OK`
  - **Cookie:** `token` (httpOnly, secure, sameSite=strict)
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "role": "user"
      }
    }
  }
  ```
  **Note:** The JWT token is set as an httpOnly cookie and is not returned in the response body for security.

#### Get Current User

- **Endpoint:** `GET /api/auth/me`
- **Description:** Get authenticated user's information
- **Authentication:** Required (Bearer token or cookie)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "role": "user"
      }
    }
  }
  ```

#### Logout User

- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logout the current user
- **Authentication:** Required (Bearer token or cookie)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "User logged out successfully"
  }
  ```

### Bookings

#### Get All Bookings

- **Endpoint:** `GET /api/bookings`
- **Description:** Get list of all bookings for the authenticated customer
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "bookings": [
        {
          "id": "booking_id",
          "bookingNumber": "BK-1234567890-1",
          "status": "pending",
          "serviceType": "Roadworthy Inspection",
          "description": "Full vehicle inspection",
          "scheduledDate": "2024-01-15T10:00:00.000Z",
          "location": "123 Main St, City",
          "attachmentCount": 2,
          "createdAt": "2024-01-10T08:00:00.000Z",
          "updatedAt": "2024-01-10T08:00:00.000Z"
        }
      ]
    }
  }
  ```

#### Get Booking by ID

- **Endpoint:** `GET /api/bookings/:id`
- **Description:** Get detailed information about a specific booking
- **Authentication:** Required
- **URL Parameters:**
  - `id` - Booking ID
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "booking": {
        "id": "booking_id",
        "bookingNumber": "BK-1234567890-1",
        "status": "pending",
        "serviceType": "Roadworthy Inspection",
        "description": "Full vehicle inspection",
        "scheduledDate": "2024-01-15T10:00:00.000Z",
        "location": "123 Main St, City",
        "attachments": [
          {
            "id": "attachment_id",
            "filename": "file123.pdf",
            "originalName": "document.pdf",
            "mimeType": "application/pdf",
            "size": 102400,
            "uploadedAt": "2024-01-10T08:30:00.000Z"
          }
        ],
        "customer": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+1234567890"
        },
        "createdAt": "2024-01-10T08:00:00.000Z",
        "updatedAt": "2024-01-10T08:00:00.000Z"
      }
    }
  }
  ```

#### Get Booking Attachments

- **Endpoint:** `GET /api/bookings/:id/attachments`
- **Description:** Get all file attachments for a specific booking
- **Authentication:** Required
- **URL Parameters:**
  - `id` - Booking ID
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "attachments": [
        {
          "id": "attachment_id",
          "filename": "file123.pdf",
          "originalName": "document.pdf",
          "mimeType": "application/pdf",
          "size": 102400,
          "path": "/uploads/file123.pdf",
          "uploadedAt": "2024-01-10T08:30:00.000Z"
        }
      ]
    }
  }
  ```

### Messages

#### Get Messages for Booking

- **Endpoint:** `GET /api/messages/booking/:bookingId`
- **Description:** Get all messages related to a specific booking
- **Authentication:** Required
- **URL Parameters:**
  - `bookingId` - Booking ID
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "messages": [
        {
          "id": "message_id",
          "content": "When will the inspection be completed?",
          "sender": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "senderType": "customer",
          "read": false,
          "booking": {
            "id": "booking_id",
            "bookingNumber": "BK-1234567890-1"
          },
          "createdAt": "2024-01-10T09:00:00.000Z",
          "updatedAt": "2024-01-10T09:00:00.000Z"
        }
      ]
    }
  }
  ```

#### Send Message for Booking

- **Endpoint:** `POST /api/messages/booking/:bookingId`
- **Description:** Send a message related to a booking
- **Authentication:** Required
- **URL Parameters:**
  - `bookingId` - Booking ID
- **Request Body:**
  ```json
  {
    "content": "When will the inspection be completed?"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "Message sent successfully",
    "data": {
      "message": {
        "id": "message_id",
        "content": "When will the inspection be completed?",
        "sender": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "senderType": "customer",
        "read": false,
        "booking": {
          "id": "booking_id",
          "bookingNumber": "BK-1234567890-1"
        },
        "createdAt": "2024-01-10T09:00:00.000Z",
        "updatedAt": "2024-01-10T09:00:00.000Z"
      }
    }
  }
  ```

### Health Check

- **Endpoint:** `GET /api/health`
- **Description:** Server health check
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-10T08:00:00.000Z"
  }
  ```

## Data Models

### User Model

```typescript
{
  _id: ObjectId,              // MongoDB document ID
  name: string,               // User's full name (required, 2-50 chars)
  email: string,              // User's email (required, unique, lowercase)
  phoneNumber?: string,       // User's phone number (optional, unique, sparse index)
  password: string,           // Hashed password (required, min 6 chars, not returned in queries)
  role: "user" | "admin",     // User role (default: "user")
  createdAt: Date,            // Account creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

**Methods:**

- `matchPassword(enteredPassword: string): Promise<boolean>` - Compare password with hash
- `getSignedJwtToken(): string` - Generate JWT token

### Booking Model

```typescript
{
  _id: ObjectId,                    // MongoDB document ID
  customer: ObjectId,                // Reference to User (required)
  bookingNumber: string,             // Unique booking identifier (auto-generated)
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",  // Booking status (default: "pending")
  serviceType: string,              // Type of service (required)
  description?: string,             // Optional booking description
  scheduledDate?: Date,             // Optional scheduled date/time
  location?: string,                // Optional service location
  attachments: FileAttachment[],    // Array of file attachments
  createdAt: Date,                  // Booking creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

### FileAttachment Model (Embedded in Booking)

```typescript
{
  _id: ObjectId,           // MongoDB document ID
  filename: string,        // Stored filename (required)
  originalName: string,    // Original filename (required)
  mimeType: string,       // File MIME type (required)
  size: number,           // File size in bytes (required)
  path: string,           // File storage path (required)
  uploadedAt: Date        // Upload timestamp (default: now)
}
```

### Message Model

```typescript
{
  _id: ObjectId,                    // MongoDB document ID
  booking: ObjectId,                // Reference to Booking (required)
  sender: ObjectId,                 // Reference to User (required)
  senderType: "customer" | "admin", // Type of sender (required)
  content: string,                  // Message content (required, max 5000 chars)
  read: boolean,                    // Read status (default: false)
  createdAt: Date,                  // Message creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

**Indexes:**

- Compound index on `{ booking: 1, createdAt: -1 }` for efficient querying

## Authentication

All protected endpoints require authentication via **httpOnly cookies**. The JWT token is automatically set in an httpOnly cookie upon login or registration.

### Cookie Configuration:
- **httpOnly:** `true` - Prevents JavaScript access (XSS protection)
- **secure:** `true` in production - Only sent over HTTPS
- **sameSite:** `strict` - CSRF protection
- **path:** `/` - Available across the entire application

### Fallback Support:
- **Bearer Token:** `Authorization: Bearer <token>` header (for API clients that cannot use cookies)

### Token Expiration:
JWT tokens expire after 7 days (configurable via `JWT_EXPIRE` environment variable).

### Important Notes:
- Tokens are **NOT** returned in JSON responses for security
- Tokens are automatically sent with each request via cookies
- Logout clears the authentication cookie

## Environment Variables

See `.env.example` for all available environment variables.

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting
- XSS protection
- HPP (HTTP Parameter Pollution) protection
- MongoDB injection protection
- JWT token authentication
- Password hashing with bcrypt

## Logging

Logs are stored in the `logs/` directory with daily rotation:

- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## License

ISC
