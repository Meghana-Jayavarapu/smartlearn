# Learning Management System (LMS) Backend

This is the backend server for the Learning Management System built with Node.js, Express, and MongoDB. It provides APIs for user authentication, course management, and content delivery.

## Features

- User authentication (JWT-based)
- Role-based access control (Student/Instructor)
- Course management
- Video content handling with Cloudinary
- Progress tracking
- Course reviews and ratings

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PATCH `/api/auth/profile` - Update user profile

### Courses

- POST `/api/courses` - Create a new course (Instructor only)
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get course by ID
- PATCH `/api/courses/:id` - Update course (Instructor only)
- POST `/api/courses/:id/lessons` - Add lesson to course (Instructor only)
- POST `/api/courses/:id/enroll` - Enroll in course
- PATCH `/api/courses/:courseId/lessons/:lessonId/progress` - Update lesson progress
- POST `/api/courses/:id/reviews` - Add review to course

## File Structure

```
├── models/
│   ├── User.js
│   └── Course.js
├── routes/
│   ├── auth.js
│   └── courses.js
├── middleware/
│   └── auth.js
├── utils/
│   └── cloudinary.js
├── uploads/
├── .env
└── server.js
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "message": "Error message here"
}
```