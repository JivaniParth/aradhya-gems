# Aradhya Gems - Backend API Server

A Node.js/Express.js backend API server for the Aradhya Gems jewelry e-commerce platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your configurations
   ```

4. Start MongoDB (if running locally):
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo mongod
   ```

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/aradhya-gems

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/aradhya-gems?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## 🔌 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| PUT | `/api/auth/password` | Change password (protected) |
| POST | `/api/auth/addresses` | Add address (protected) |
| PUT | `/api/auth/addresses/:id` | Update address (protected) |
| DELETE | `/api/auth/addresses/:id` | Delete address (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

**Product Query Parameters:**
- `category` - Filter by category slug
- `material` - Filter by material ID
- `minPrice` / `maxPrice` - Price range
- `isNew` - New arrivals (true/false)
- `isBestSeller` - Best sellers (true/false)
- `occasion` - Filter by occasion
- `search` - Text search
- `sort` - Sort by: `price-low`, `price-high`, `name`, `rating`, `popularity`
- `page` / `limit` - Pagination

### Cart (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update item quantity |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear cart |

### Orders (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id/cancel` | Cancel order |

### Wishlist (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist/:productId` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |
| PUT | `/api/wishlist/:productId` | Toggle wishlist item |
| DELETE | `/api/wishlist` | Clear wishlist |

### Admin Routes (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/users/:id` | Get user details |
| PUT | `/api/admin/users/:id` | Update user |
| GET | `/api/admin/inventory` | Inventory report |
| GET | `/api/orders/admin/all` | Get all orders |
| PUT | `/api/orders/:id/status` | Update order status |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**To access protected routes, include the token in the Authorization header:**
```
Authorization: Bearer <your_jwt_token>
```

## 👤 Test Accounts

After running the seed script, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aradhyagems.com | admin123 |
| Customer | customer@example.com | customer123 |

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── error.js           # Error handling
├── models/
│   ├── User.js            # User model
│   ├── Product.js         # Product model
│   ├── Order.js           # Order model
│   ├── Cart.js            # Cart model
│   └── Category.js        # Category model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── products.js        # Product routes
│   ├── cart.js            # Cart routes
│   ├── orders.js          # Order routes
│   ├── wishlist.js        # Wishlist routes
│   └── admin.js           # Admin routes
├── main.js                # App entry point
├── seed.js                # Database seeder
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "password": "customer123"}'

# Get products with filters
curl "http://localhost:5000/api/products?category=necklaces&minPrice=10000&maxPrice=50000"
```

### Using Postman

1. Import the API endpoints
2. Set up an environment variable for `baseUrl`: `http://localhost:5000/api`
3. For protected routes, add the JWT token to the Authorization header

## 🗄️ MongoDB Setup

### Local MongoDB

1. Download and install MongoDB Community Server
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/aradhya-gems`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Update `.env` with your Atlas connection string

## 📦 Available Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes middleware
- Role-based access control (customer/admin)
- Input validation with express-validator
- CORS configuration
- Error handling middleware

## 📄 License

ISC License - Parth Jivani
