# Expense Tracker API By Ahmed Hesham

## Overview

The Expense Tracker API allows users to track and manage personal expenses. Users can create accounts, login securely, and perform CRUD operations (Create, Read, Update, Delete) on their expense records. The API includes filtering capabilities to view expenses by date ranges and categories.

## Technology Stack

*   **Backend Framework:** Node.js with Express.js
*   **Database:** MySQL
*   **ORM:** Sequelize
*   **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken`
*   **Password Hashing:** `bcryptjs`
*   **Input Validation:** `express-validator`
*   **Security:** `helmet` (Security Headers), `cors` (Cross-Origin Resource Sharing)
*   **Rate Limiting:** `express-rate-limit`
*   **Environment Variables:** `dotenv`

## Base URL

```
https://your-api-domain.com/api/v1
```

For local development:
```
http://localhost:3000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. 

### Register a New User

**Endpoint:** `POST /auth/signup`

**Description:** Creates a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Requirements:**
- `username`: Must be alphanumeric and unique
- `password`: Must be at least 8 characters long

**Response (201 Created):**
```json
{
  "_id": 1,
  "username": "johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possible Errors:**
- `400 Bad Request`: Username already exists or invalid input
- `500 Internal Server Error`: Server error

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates user and returns a JWT token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "_id": 1,
  "username": "johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possible Errors:**
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

### Using Authentication

For all endpoints that require authentication, include the JWT token in the request header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Expense Management

All expense endpoints require authentication.

### Create a New Expense

**Endpoint:** `POST /expenses`

**Description:** Creates a new expense record.

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "description": "Weekly groceries",
  "amount": 45.75,
  "category": "Groceries",
  "date": "2024-07-15"
}
```

**Required Fields:**
- `amount`: Positive decimal number (up to 2 decimal places)
- `category`: One of: "Groceries", "Leisure", "Electronics", "Utilities", "Clothing", "Health", "Others"
- `date`: Date in YYYY-MM-DD format

**Optional Fields:**
- `description`: Text description of the expense

**Response (201 Created):**
```json
{
  "id": 1,
  "description": "Weekly groceries",
  "amount": "45.75",
  "category": "Groceries",
  "date": "2024-07-15",
  "userId": 1,
  "createdAt": "2024-07-15T14:30:00.000Z",
  "updatedAt": "2024-07-15T14:30:00.000Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

### Get All Expenses

**Endpoint:** `GET /expenses`

**Description:** Retrieves all expenses for the authenticated user.

**Headers:**
```
Authorization: Bearer <your_token>
```

**Filtering Options (Query Parameters):**

| Parameter | Description | Example |
|-----------|-------------|---------|
| filter | Predefined date filter | `week`, `month`, `3months` |
| startDate | Custom range start date (YYYY-MM-DD) | `2024-07-01` |
| endDate | Custom range end date (YYYY-MM-DD) | `2024-07-31` |
| category | Filter by category | `Groceries` or multiple: `Groceries,Utilities` |
| minAmount | Minimum expense amount | `10` |
| maxAmount | Maximum expense amount | `100` |
| description | Search in description text (case-insensitive) | `coffee` |

**Examples:**
- Get expenses from current month: `/expenses?filter=month`
- Get groceries from last week: `/expenses?filter=week&category=Groceries`
- Get expenses between dates: `/expenses?startDate=2024-06-01&endDate=2024-06-30`
- Get expenses between $20 and $50: `/expenses?minAmount=20&maxAmount=50`
- Get coffee-related expenses: `/expenses?description=coffee`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "description": "Weekly groceries",
    "amount": "45.75",
    "category": "Groceries",
    "date": "2024-07-15",
    "userId": 1,
    "createdAt": "2024-07-15T14:30:00.000Z",
    "updatedAt": "2024-07-15T14:30:00.000Z"
  },
  {
    "id": 2,
    "description": "Cell phone bill",
    "amount": "65.00",
    "category": "Utilities",
    "date": "2024-07-10",
    "userId": 1,
    "createdAt": "2024-07-10T09:15:00.000Z",
    "updatedAt": "2024-07-10T09:15:00.000Z"
  }
  // More expenses...
]
```

**Possible Errors:**
- `400 Bad Request`: Invalid filter parameters
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

### Get Specific Expense

**Endpoint:** `GET /expenses/:id`

**Description:** Retrieves a specific expense by ID.

**Headers:**
```
Authorization: Bearer <your_token>
```

**Path Parameters:**
- `id`: ID of the expense to retrieve

**Response (200 OK):**
```json
{
  "id": 1,
  "description": "Weekly groceries",
  "amount": "45.75",
  "category": "Groceries",
  "date": "2024-07-15",
  "userId": 1,
  "createdAt": "2024-07-15T14:30:00.000Z",
  "updatedAt": "2024-07-15T14:30:00.000Z"
}
```

**Possible Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Expense not found or doesn't belong to the user
- `500 Internal Server Error`: Server error

### Update Expense

**Endpoint:** `PUT /expenses/:id`

**Description:** Updates an existing expense.

**Headers:**
```
Authorization: Bearer <your_token>
```

**Path Parameters:**
- `id`: ID of the expense to update

**Request Body (include only fields to update):**
```json
{
  "description": "Updated grocery description",
  "amount": 50.25
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "description": "Updated grocery description",
  "amount": "50.25",
  "category": "Groceries",
  "date": "2024-07-15",
  "userId": 1,
  "createdAt": "2024-07-15T14:30:00.000Z",
  "updatedAt": "2024-07-15T15:45:00.000Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Expense not found or doesn't belong to the user
- `500 Internal Server Error`: Server error

### Delete Expense

**Endpoint:** `DELETE /expenses/:id`

**Description:** Deletes an expense.

**Headers:**
```
Authorization: Bearer <your_token>
```

**Path Parameters:**
- `id`: ID of the expense to delete

**Response (200 OK):**
```json
{
  "message": "Expense removed"
}
```

**Possible Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Expense not found or doesn't belong to the user
- `500 Internal Server Error`: Server error

## Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API is running.

**Response (200 OK):**
```json
{
  "status": "OK",
  "version": "v1"
}
```

## Categories

The API supports the following expense categories:
- `Groceries`: Food and household supplies
- `Leisure`: Entertainment, dining out, etc.
- `Electronics`: Tech purchases, gadgets
- `Utilities`: Bills, services
- `Clothing`: Apparel and accessories
- `Health`: Medical expenses, medications
- `Others`: Miscellaneous expenses

## Rate Limiting

To prevent abuse, the API enforces rate limiting:
- 100 requests per IP address per 15-minute window
- Exceeding this limit will result in a `429 Too Many Requests` error

## Error Responses

Error responses follow this format:
```json
{
  "message": "Error message describing what went wrong",
  "stack": "Stack trace (only in development mode)"
}
```

For validation errors:
```json
{
  "errors": [
    {
      "value": "invalidValue",
      "msg": "Error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

## Security Best Practices

1. **Token Storage**: Never store JWTs in browser localStorage. Use secure, httpOnly cookies instead.
2. **Token Expiration**: Tokens expire after 1 hour. You'll need to re-authenticate after expiration.
3. **HTTPS**: Always use HTTPS in production environments to encrypt data in transit.
4. **Strong Passwords**: Although the API minimum is 8 characters, use stronger passwords with mixed case, numbers, and symbols.
5. **Environment Variables**: Store sensitive information (like JWT secret) in environment variables, not in code.

## Project URLs
- https://roadmap.sh/projects/expense-tracker-api
- https://github.com/AhmedHeshamC/expenseTrackerAPI

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Write tests
4. Submit a PR

Please adhere to the existing code style and coverage requirements.

---

© 2025 Ahmed Hesham. MIT License.
