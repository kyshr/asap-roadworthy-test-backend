# Technical Notes

## What was built

A RESTful API backend for a customer booking management system built with Express.js, TypeScript, and MongoDB. The system includes:

- **Authentication System**: User registration and login supporting both email and phone number identifiers, with JWT token-based authentication using httpOnly cookies for security
- **Booking Management**: Full CRUD operations for bookings including create, read, update, and soft delete functionality
- **Message System**: Customers can send and receive messages related to their bookings, with messages persisted in the database
- **Password Management**: Users can update their passwords with current password verification

Key features:

- Auto-generated unique booking numbers (format: BK-{timestamp}-{random})
- Soft delete implementation for bookings (preserves data with deletedAt timestamp)
- Input validation using Zod schemas
- Error handling with appropriate HTTP status codes
- Security middleware (Helmet, CORS, rate limiting, XSS protection)

## Reasoning behind your approach

**Clean Architecture Pattern**: Implemented a layered architecture (Models → Repositories → Services → Controllers → Routes) to separate concerns, improve testability, and maintainability. This allows for easy modification of individual layers without affecting others.

**Repository Pattern**: Abstracted database operations into repositories to decouple business logic from data access, making it easier to switch databases or implement caching in the future.

**Service Layer**: Business logic is centralized in services, keeping controllers thin and focused on HTTP request/response handling.

**httpOnly Cookies**: Chose httpOnly cookies over localStorage for JWT storage to prevent XSS attacks, as cookies cannot be accessed via JavaScript.

**Soft Delete**: Implemented soft delete for bookings instead of hard delete to maintain data integrity and allow for potential recovery or audit trails.

**Auto-generated Booking Numbers**: Used pre-save hooks in Mongoose to automatically generate unique booking numbers, ensuring consistency and preventing user errors.

**Zod Validation**: Used Zod for runtime type checking and validation at the API boundary, providing clear error messages and type safety.

## Assumptions made

- MongoDB is the chosen database system
- Users authenticate using either email or phone number (not both simultaneously)
- Booking numbers must be unique across all bookings
- Soft-deleted bookings should be excluded from all queries by default
- Customers can only access and modify their own bookings
- Password updates require verification of current password
- JWT tokens are stored in httpOnly cookies for web clients, with Bearer token fallback for API clients
- All timestamps are handled in UTC
- Booking status transitions are managed by the client (no server-side validation of status transitions)
- No file upload functionality is required (removed from initial implementation)

## Potential improvements

- **Pagination**: Implement pagination for booking and message listings to handle large datasets efficiently
- **Filtering and Sorting**: Add query parameters for filtering bookings by status, date range, and sorting options
- **Email Notifications**: Send email notifications for booking status changes, new messages, and password updates
- **Rate Limiting per User**: Implement user-specific rate limiting in addition to global rate limiting
- **Audit Logging**: Add comprehensive audit logging for all create, update, and delete operations
- **Booking Status Validation**: Implement server-side validation for booking status transitions (e.g., cannot change from "completed" to "pending")
- **Search Functionality**: Add search capabilities for bookings by service type, location, or booking number
- **File Upload**: Re-implement file attachment functionality if needed, with proper storage and access control
- **Caching**: Implement Redis caching for frequently accessed data like user profiles and booking lists
- **Database Indexing**: Add additional indexes for common query patterns (e.g., status, scheduledDate)
- **Input Sanitization**: Enhance input sanitization beyond what's provided by express-mongo-sanitize
- **API Versioning**: Implement API versioning strategy for future backward compatibility
- **WebSocket Support**: Add real-time messaging using WebSockets for instant message delivery
- **Booking Conflicts**: Implement logic to detect and prevent scheduling conflicts
- **Multi-language Support**: Add internationalization for error messages and responses

## How AI assisted your workflow

AI assistance was used throughout the development process to:

- **Code Generation**: Generated initial implementations for models, repositories, services, controllers, and routes following established patterns
- **Architecture Decisions**: Provided recommendations on clean architecture patterns, security best practices, and database design
- **Bug Fixing**: Identified and resolved issues such as bcrypt password hashing implementation, booking number auto-generation, and email lookup case sensitivity
- **Documentation**: Created and maintained comprehensive API documentation in README.md with request/response examples
- **Code Refactoring**: Suggested improvements for code organization, error handling, and type safety
- **Validation Logic**: Helped design Zod validation schemas for all API endpoints
- **Security Implementation**: Guided implementation of httpOnly cookies, password hashing, and authentication middleware
- **Problem Solving**: Debugged issues like login failures, booking creation errors, and TypeScript type mismatches
- **Feature Implementation**: Implemented features like soft delete, password updates, and auto-generated booking numbers based on requirements

The AI acted as a pair programming partner, providing immediate feedback, suggesting best practices, and helping maintain consistency across the codebase.

## Setup

- Run in local only
- Create .env in root directory. You can refer to the .env.example for the data or use the test .env below.<br/>
  NODE_ENV=development <br/>
  PORT=5000 <br/>
  MONGODB_URI=mongodb+srv://cspadmin:Q5qEQ7LiaBKCCFsI@csp-db.zsnp9b1.mongodb.net/test-db?retryWrites=true&w=majority <br/>
  MONGODB_URI_TEST=mongodb+srv://cspadmin:Q5qEQ7LiaBKCCFsI@csp-db.zsnp9b1.mongodb.net/test-db?retryWrites=true&w=majority <br/>
  JWT_SECRET=e66ead1a394a9cc9d1439835f63c74e207048ca8d3d2107539a5e4ec554f74a2 <br/>
  JWT_EXPIRE=7d <br/>
  JWT_COOKIE_EXPIRE=7 <br/>
  BCRYPT_ROUNDS=12 <br/>
  RATE_LIMIT_WINDOW_MS=900000 <br/>
  RATE_LIMIT_MAX_REQUESTS=100 <br/>
  CORS_ORIGIN=http://localhost:3000 <br/>
  LOG_LEVEL=info

- Install the dependencies by running **npm install**
- Start the app by running **npm run dev**
