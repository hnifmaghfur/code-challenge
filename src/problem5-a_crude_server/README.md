# Problem 5 - A Crude Server

## Description

This server provides a robust RESTful API for managing books, supporting operations to create, read, update, and delete (CRUD) book records. It implements both basic authentication and JWT token-based authentication to ensure secure access control. All book data is persistently stored in an SQLite database, offering lightweight yet reliable data management.

## Author
**Hanif Maghfur**
- Website: [maghfur.dev](https://maghfur.dev)
- Email: [hanif@maghfur.dev](mailto:hanif@maghfur.dev)
- GitHub: [@hnifmaghfur](https://github.com/hnifmaghfur)
- LinkedIn: [Hanif Maghfur](https://www.linkedin.com/in/hnifmaghfur/)

## Technologies Used

- TypeScript
- Node.js
- Express
- SQLite
- Winston
- JWT
- Zod Validation

## Project Structure

```
src/
├── app/
│   └── server.ts              # Express router setup
├── auth/
│   ├── basic_auth.ts         # Basic authentication middleware
│   └── jwt.ts                # JWT handling
├── handlers/
│   └── api_handlers.ts       # API endpoint handlers
├── modules/
│   ├── commands/             # Business logic layer
│   │   ├── book.ts
│   │   └── user.ts
│   └── models/              # Data access layer
│       ├── book.ts
│       └── user.ts
├── types/                   # TypeScript type definitions
│   ├── auth.ts
│   ├── book.ts
│   ├── date.ts
│   ├── response.ts
│   └── user.ts
├── utils/                   # Utility functions
│   ├── date_format.ts
│   ├── db.ts               # Database connection
│   ├── logger.ts           # Winston logger setup
│   └── wrapper.ts          # Response wrapper
├── global_config.ts        # Global configuration
└── index.ts               # Application entry point
```

## Setup

1. Clone the repository with the following command:

```bash
git clone https://github.com/hnifmaghfur/code-challenge
```


2. Go to the `problem5-a_crude_server` directory

```bash
cd code-challenge/src/problem5-a_crude_server/
```


3. Install dependencies with the following command:

```bash
npm install
```


3. Copy the `.env.example` file to `.env` and set the environment variables

```bash
cp .env.example .env
```


4. Start the server with the following command:

```bash
npm start
```


5. Use the API to create, read, update, and delete books

## API Documentation

### Postman Collection

For easier testing, you can use our Postman collection:

1. Import the Postman collection from `task5_a_crude_server.postman_collection`
2. Set up environment variables in Postman:
   - `url`: Your server URL (default: http://localhost:3000)
   - `token`: Will be automatically set after login

### API Endpoints

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "<your_jwt_token>"
  }
}
```

#### Create a book

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published_year": 1925,
    "genre": "Fiction"
  }'
```

#### Get all books

```bash
curl -X GET http://localhost:3000/api/v1/books?page=1&limit=10 \
  -H "Authorization: Bearer <your_token>"
```

#### Get a book by id

```bash
curl -X GET http://localhost:3000/api/v1/books/1 \
  -H "Authorization: Bearer <your_token>"
```

#### Update a book by id

```bash
curl -X PATCH http://localhost:3000/api/v1/books/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published_year": 1925,
    "genre": "Fiction"
  }'
```

#### Delete a book by id

```bash
curl -X POST http://localhost:3000/api/v1/books/1/del \
  -H "Authorization: Bearer <your_token>"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional error details"
}
```

