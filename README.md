# BEE1 - Restaurant Management System

A comprehensive full-stack restaurant management system with admin panels, restaurant owner management, and user ordering capabilities. Built with Express.js, MongoDB, and Mongoose.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Admin](#admin)
  - [Restaurants](#restaurants)
  - [Dishes](#dishes)
  - [Orders](#orders)
  - [Users](#users)
  - [Search](#search)
  - [Chatbot](#chatbot)

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Three Role System**: Admin, Restaurant Owner, and Regular User roles
- **Restaurant Management**: Create and manage restaurant profiles with images and geolocation
- **Dish Management**: Create, update, and delete dishes for restaurants
- **Order System**: Users can create orders, track status, restaurant owners can manage orders
- **Search Functionality**: Search for restaurants and dishes with filtering
- **AI Chatbot**: Powered by Google Generative AI for dish suggestions and conversations
- **Admin Dashboard**: Comprehensive admin panel for managing users and restaurants

## Tech Stack

- **Backend**: Node.js, Express.js 5.1
- **Database**: MongoDB with Mongoose 8.18
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer 2.0
- **Validation**: Express-validator 7.2
- **Password Hashing**: bcryptjs 3.0
- **AI Integration**: Google Generative AI SDK
- **Others**: CORS, dotenv

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BEE1
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with required environment variables (see [Environment Variables](#environment-variables))

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
GOOGLE_API_KEY=<your-google-generative-ai-api-key>
```

## Running the Project

### Development Mode (with nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:5000` (or your configured PORT)

---

# API Endpoints

## Authentication

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Register a new user account
- **Authentication**: Not required
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user|restaurant_owner|admin",
  "phone": "1234567890",
  "address": "123 Main St"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```
- **Validation Rules**:
  - `name`: Required, must not be empty
  - `email`: Required, must be valid email format
  - `password`: Required, minimum 6 characters

---

### Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticate user and receive JWT token
- **Authentication**: Not required
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```
- **Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private
- **Description**: Get the current authenticated user's information
- **Authentication**: Required (Bearer Token)
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

---

## Admin

### Get Dashboard
- **Endpoint**: `GET /api/admin/dashboard`
- **Access**: Private - Admin only
- **Description**: Get admin dashboard with system statistics
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalRestaurants": 25,
    "totalOrders": 500,
    "recentOrders": []
  }
}
```

---

### Get All Users
- **Endpoint**: `GET /api/admin/users`
- **Access**: Private - Admin only
- **Description**: Retrieve all registered users
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get All Restaurants
- **Endpoint**: `GET /api/admin/restaurants`
- **Access**: Private - Admin only
- **Description**: Retrieve all restaurants
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "restaurant_id",
      "name": "Restaurant Name",
      "owner": {
        "_id": "owner_id",
        "name": "Owner Name",
        "email": "owner@example.com"
      },
      "isActive": true
    }
  ]
}
```

---

## Restaurants

### Get All Active Restaurants
- **Endpoint**: `GET /api/restaurants`
- **Access**: Public
- **Description**: Retrieve all active restaurants
- **Authentication**: Not required
- **Query Parameters**: None
- **Response** (200):
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "restaurant_id",
      "name": "Pizza Palace",
      "description": "Best pizza in town",
      "cuisineType": "Italian",
      "image": "/uploads/restaurant_image.jpg",
      "phone": "555-1234",
      "address": "123 Food St",
      "location": {
        "type": "Point",
        "coordinates": [-73.935242, 40.730610]
      },
      "rating": 4.5,
      "isActive": true,
      "owner": {
        "_id": "owner_id",
        "name": "Owner Name",
        "email": "owner@example.com"
      }
    }
  ]
}
```

---

### Get Single Restaurant
- **Endpoint**: `GET /api/restaurants/:id`
- **Access**: Public
- **Description**: Retrieve details of a specific restaurant
- **Authentication**: Not required
- **URL Parameters**:
  - `id` (required): Restaurant ID
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "restaurant_id",
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "cuisineType": "Italian",
    "image": "/uploads/restaurant_image.jpg",
    "phone": "555-1234",
    "address": "123 Food St",
    "location": {
      "type": "Point",
      "coordinates": [-73.935242, 40.730610]
    },
    "rating": 4.5,
    "isActive": true
  }
}
```
- **Error Response** (404):
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

### Create Restaurant
- **Endpoint**: `POST /api/restaurants`
- **Access**: Private - Restaurant Owner, Admin
- **Description**: Create a new restaurant
- **Authentication**: Required (Bearer Token)
- **Authorization**: restaurant_owner or admin role
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```
- **Request Body** (multipart/form-data):
```
name: "New Restaurant"
description: "Restaurant description"
cuisineType: "Italian"
phone: "555-1234"
address: "123 Food St"
latitude: "40.730610"
longitude: "-73.935242"
image: <file>
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "restaurant_id",
    "name": "New Restaurant",
    "description": "Restaurant description",
    "cuisineType": "Italian",
    "phone": "555-1234",
    "address": "123 Food St",
    "location": {
      "type": "Point",
      "coordinates": [-73.935242, 40.730610]
    },
    "image": "/uploads/filename.jpg",
    "isActive": true,
    "owner": "owner_id"
  }
}
```

---

### Update Restaurant
- **Endpoint**: `PUT /api/restaurants/:id`
- **Access**: Private - Restaurant Owner (of that restaurant), Admin
- **Description**: Update an existing restaurant
- **Authentication**: Required (Bearer Token)
- **Authorization**: Must be the restaurant owner or admin
- **URL Parameters**:
  - `id` (required): Restaurant ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```
- **Request Body** (multipart/form-data - all optional):
```
name: "Updated Name"
description: "Updated description"
cuisineType: "French"
phone: "555-5678"
address: "456 Main St"
latitude: "40.730610"
longitude: "-73.935242"
image: <file>
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "restaurant_id",
    "name": "Updated Name",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get My Restaurants
- **Endpoint**: `GET /api/restaurants/owner/me`
- **Access**: Private - Restaurant Owner, Admin
- **Description**: Get restaurants owned by the current user
- **Authentication**: Required (Bearer Token)
- **Authorization**: restaurant_owner or admin role
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "restaurant_id_1",
      "name": "My Restaurant 1",
      "description": "First restaurant",
      "isActive": true
    },
    {
      "_id": "restaurant_id_2",
      "name": "My Restaurant 2",
      "description": "Second restaurant",
      "isActive": true
    }
  ]
}
```

---

### Search Nearby Restaurants
- **Endpoint**: `GET /api/restaurants/search/nearby`
- **Access**: Public
- **Description**: Search for restaurants near a specific location
- **Authentication**: Not required
- **Query Parameters**:
  - `latitude` (required): User's latitude coordinate
  - `longitude` (required): User's longitude coordinate
  - `maxDistance` (optional): Maximum distance in meters (default: 5000)
- **Example Request**:
```
GET /api/restaurants/search/nearby?latitude=40.730610&longitude=-73.935242&maxDistance=3000
```
- **Response** (200):
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "restaurant_id",
      "name": "Nearby Restaurant",
      "distance": 1200,
      "cuisineType": "Italian"
    }
  ]
}
```

---

## Dishes

### Get All Dishes
- **Endpoint**: `GET /api/dishes`
- **Access**: Public
- **Description**: Retrieve all available dishes
- **Authentication**: Not required
- **Response** (200):
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "dish_id",
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 12.99,
      "cuisine": "Italian",
      "vegetarian": true,
      "restaurant": {
        "_id": "restaurant_id",
        "name": "Pizza Palace"
      },
      "image": "/uploads/pizza.jpg"
    }
  ]
}
```

---

### Get Dishes by Restaurant
- **Endpoint**: `GET /api/dishes/restaurant/:restaurantId`
- **Access**: Public
- **Description**: Get all dishes from a specific restaurant
- **Authentication**: Not required
- **URL Parameters**:
  - `restaurantId` (required): Restaurant ID
- **Response** (200):
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "dish_id",
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 12.99,
      "cuisine": "Italian",
      "vegetarian": true,
      "image": "/uploads/pizza.jpg"
    }
  ]
}
```

---

### Create Dish
- **Endpoint**: `POST /api/dishes`
- **Access**: Private - Restaurant Owner, Admin
- **Description**: Create a new dish
- **Authentication**: Required (Bearer Token)
- **Authorization**: restaurant_owner or admin role
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body**:
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 12.99,
  "cuisine": "Italian",
  "vegetarian": true,
  "restaurant": "restaurant_id",
  "image": "/uploads/pizza.jpg",
  "preparationTime": 20,
  "availability": true
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "dish_id",
    "name": "Margherita Pizza",
    "restaurant": "restaurant_id",
    "price": 12.99,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Dish
- **Endpoint**: `PUT /api/dishes/:id`
- **Access**: Private - Restaurant Owner (of that dish's restaurant), Admin
- **Description**: Update an existing dish
- **Authentication**: Required (Bearer Token)
- **Authorization**: Must be the restaurant owner or admin
- **URL Parameters**:
  - `id` (required): Dish ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body** (all optional):
```json
{
  "name": "Updated Dish Name",
  "description": "Updated description",
  "price": 14.99,
  "cuisine": "Italian",
  "vegetarian": false,
  "availability": true
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "dish_id",
    "name": "Updated Dish Name",
    "price": 14.99,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Delete Dish
- **Endpoint**: `DELETE /api/dishes/:id`
- **Access**: Private - Restaurant Owner (of that dish's restaurant), Admin
- **Description**: Delete a dish
- **Authentication**: Required (Bearer Token)
- **Authorization**: Must be the restaurant owner or admin
- **URL Parameters**:
  - `id` (required): Dish ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Dish deleted successfully"
}
```

---

## Orders

### Create Order
- **Endpoint**: `POST /api/orders`
- **Access**: Private - User only
- **Description**: Create a new order
- **Authentication**: Required (Bearer Token)
- **Authorization**: user role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body**:
```json
{
  "restaurant": "restaurant_id",
  "items": [
    {
      "dish": "dish_id",
      "quantity": 2,
      "price": 12.99
    },
    {
      "dish": "dish_id_2",
      "quantity": 1,
      "price": 8.99
    }
  ],
  "totalAmount": 34.97,
  "deliveryAddress": "123 Main St, Apt 5",
  "specialInstructions": "No onions",
  "estimatedDeliveryTime": "30-45 minutes"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": "user_id",
    "restaurant": "restaurant_id",
    "items": [
      {
        "dish": "dish_id",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 34.97,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get User Orders
- **Endpoint**: `GET /api/orders/my-orders`
- **Access**: Private - User only
- **Description**: Get all orders placed by the current user
- **Authentication**: Required (Bearer Token)
- **Authorization**: user role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "order_id",
      "restaurant": {
        "_id": "restaurant_id",
        "name": "Pizza Palace"
      },
      "totalAmount": 34.97,
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Restaurant Orders
- **Endpoint**: `GET /api/orders/restaurant/:restaurantId`
- **Access**: Private - Restaurant Owner (of that restaurant), Admin
- **Description**: Get all orders for a specific restaurant
- **Authentication**: Required (Bearer Token)
- **Authorization**: Must be the restaurant owner or admin
- **URL Parameters**:
  - `restaurantId` (required): Restaurant ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 42,
  "data": [
    {
      "_id": "order_id",
      "user": {
        "_id": "user_id",
        "name": "Customer Name",
        "phone": "555-1234"
      },
      "items": [
        {
          "dish": "dish_id",
          "quantity": 2
        }
      ],
      "totalAmount": 34.97,
      "status": "pending",
      "deliveryAddress": "123 Main St"
    }
  ]
}
```

---

### Get Single Order
- **Endpoint**: `GET /api/orders/:id`
- **Access**: Private
- **Description**: Get details of a specific order
- **Authentication**: Required (Bearer Token)
- **URL Parameters**:
  - `id` (required): Order ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "restaurant": {
      "_id": "restaurant_id",
      "name": "Pizza Palace"
    },
    "items": [
      {
        "dish": "dish_id",
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 34.97,
    "status": "pending",
    "deliveryAddress": "123 Main St, Apt 5",
    "specialInstructions": "No onions",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Order Status
- **Endpoint**: `PUT /api/orders/:id/status`
- **Access**: Private - Restaurant Owner (of that order's restaurant), Admin
- **Description**: Update the status of an order
- **Authentication**: Required (Bearer Token)
- **Authorization**: Must be the restaurant owner or admin
- **URL Parameters**:
  - `id` (required): Order ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body**:
```json
{
  "status": "preparing|ready|out_for_delivery|delivered|cancelled"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "preparing",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

## Users

### Get All Users
- **Endpoint**: `GET /api/users`
- **Access**: Private - Admin only
- **Description**: Retrieve all users
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "1234567890",
      "address": "123 Main St",
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### Get Single User
- **Endpoint**: `GET /api/users/:id`
- **Access**: Private - Admin only
- **Description**: Get details of a specific user
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **URL Parameters**:
  - `id` (required): User ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-10T08:00:00Z"
  }
}
```

---

### Update User
- **Endpoint**: `PUT /api/users/:id`
- **Access**: Private - Admin only
- **Description**: Update user information
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **URL Parameters**:
  - `id` (required): User ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body** (all optional):
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "9876543210",
  "address": "456 Oak Ave"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Delete User
- **Endpoint**: `DELETE /api/users/:id`
- **Access**: Private - Admin only
- **Description**: Delete a user account
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role only
- **URL Parameters**:
  - `id` (required): User ID
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
```
- **Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Search

### Global Search
- **Endpoint**: `GET /api/search`
- **Access**: Public
- **Description**: Search for restaurants and/or dishes
- **Authentication**: Not required
- **Query Parameters**:
  - `q` (required): Search query string
  - `type` (optional): Search type - `restaurants`, `dishes`, or `all` (default: `all`)
- **Example Requests**:
```
GET /api/search?q=pizza
GET /api/search?q=margherita&type=dishes
GET /api/search?q=italian&type=restaurants
```
- **Response** (200):
```json
{
  "success": true,
  "results": {
    "restaurants": [
      {
        "_id": "restaurant_id",
        "name": "Pizza Palace",
        "description": "Best pizza in town",
        "cuisineType": "Italian",
        "rating": 4.5
      }
    ],
    "dishes": [
      {
        "_id": "dish_id",
        "name": "Margherita Pizza",
        "description": "Classic pizza with tomato and mozzarella",
        "price": 12.99,
        "restaurant": "Pizza Palace"
      }
    ]
  }
}
```

---

## Chatbot

### Get Dish Suggestions
- **Endpoint**: `POST /api/chatbot/suggest`
- **Access**: Private - User only
- **Description**: Get AI-powered dish suggestions based on user prompt
- **Authentication**: Required (Bearer Token)
- **Authorization**: user role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body**:
```json
{
  "prompt": "I'm in the mood for something spicy and vegetarian"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "suggestions": "Based on your preference, here are some great options:\n\n1. **Spicy Vegetable Curry** - A delicious blend of seasonal vegetables...\n2. **Paneer Tikka Masala** - Marinated cottage cheese cooked in a spicy tomato sauce...",
    "suggestedDishes": [
      {
        "_id": "dish_id_1",
        "name": "Spicy Vegetable Curry",
        "restaurant": "Restaurant Name",
        "price": 10.99
      }
    ]
  }
}
```

---

### Chat with Chatbot
- **Endpoint**: `POST /api/chatbot/chat`
- **Access**: Private - User only
- **Description**: Multi-turn conversation with AI chatbot about restaurants and dishes
- **Authentication**: Required (Bearer Token)
- **Authorization**: user role only
- **Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
- **Request Body**:
```json
{
  "message": "What's your favorite restaurant around here?"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "reply": "I'd be happy to help! Based on what's available, I recommend checking out our top-rated restaurants...",
    "conversationHistory": [
      {
        "role": "user",
        "content": "What's your favorite restaurant around here?"
      },
      {
        "role": "chatbot",
        "content": "I'd be happy to help! Based on what's available..."
      }
    ]
  }
}
```

---

## Authentication Notes

### JWT Token Usage
All protected endpoints require a JWT token passed in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the `/api/auth/login` or `/api/auth/register` endpoints.

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **user** | Can place orders, view restaurants/dishes, use chatbot |
| **restaurant_owner** | Can create/manage restaurants and dishes, view/manage own restaurant orders |
| **admin** | Full access to all endpoints and features |

---

## Error Handling

All endpoints return error responses in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: validation errors array
}
```

### Common HTTP Status Codes
- `200` - OK: Request successful
- `201` - Created: Resource successfully created
- `400` - Bad Request: Invalid input or validation failed
- `401` - Unauthorized: Missing or invalid authentication token
- `403` - Forbidden: Sufficient permissions required
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error

---

## Project Structure

```
BEE1/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json           # Dependencies
├── config/
│   ├── database.js        # MongoDB connection
│   └── multer.js          # File upload configuration
├── controllers/           # API logic
│   ├── authController.js
│   ├── adminController.js
│   ├── restaurantController.js
│   ├── dishController.js
│   ├── orderController.js
│   ├── userController.js
│   ├── searchController.js
│   └── chatbotController.js
├── routes/                # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── restaurants.js
│   ├── dishes.js
│   ├── orders.js
│   ├── users.js
│   ├── search.js
│   └── chatbot.js
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT verification
│   └── roleCheck.js      # Role authorization
├── models/               # Mongoose schemas
│   ├── User.js
│   ├── Restaurant.js
│   ├── Dish.js
│   ├── Order.js
│   └── QuickOrder.js
├── utils/                # Utility functions
│   └── generateToken.js
└── public/               # Static files & frontend
    ├── index.html
    ├── menu.html
    ├── search.html
    ├── chatbot.html
    └── uploads/          # User uploaded files
```

---

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please contact the development team.
