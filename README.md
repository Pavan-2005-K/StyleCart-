# StyleCart – Fashion E-Commerce Website

StyleCart is a full-stack fashion e-commerce web application where customers can explore fashion products, manage their shopping carts, place Cash on Delivery (COD) orders, and track their purchases. Administrators can manage products and customer orders through an admin dashboard.

## Features

### Customer Features
- Browse fashion products.
- Explore products by category.
- Search and sort products.
- View product details and available sizes.
- Add products to the shopping cart.
- Update product quantities and remove cart items.
- Register and log in securely.
- Place orders using Cash on Delivery (COD).
- View order history.
- Track order status.

### Admin Features
- Admin dashboard.
- View product and order statistics.
- Add new products.
- Edit existing products.
- Delete products.
- View customer orders.
- Update order statuses.
- View customer and shipping information.

## Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
StyleCart/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Community Server
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd StyleCart
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/stylecart
JWT_SECRET=replace_with_a_secure_secret
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Overview

The backend provides REST API endpoints for authentication, products, shopping carts, users, and orders.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Customer or admin login |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Add a product (Admin) |
| PUT | `/api/products/:id` | Update a product (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin) |
| GET | `/api/cart` | Get shopping cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:productId` | Update cart item |
| DELETE | `/api/cart/remove/:productId` | Remove cart item |
| DELETE | `/api/cart/clear` | Clear shopping cart |
| POST | `/api/orders/checkout` | Place an order |
| GET | `/api/orders/my-orders` | Get customer orders |
| GET | `/api/orders/:id` | Get order details |
| GET | `/api/orders/admin/all` | Get all orders (Admin) |
| PUT | `/api/orders/admin/:id/status` | Update order status (Admin) |

Protected endpoints require a valid JWT Bearer token.

## Payment Method

Currently, StyleCart supports **Cash on Delivery (COD)**.

Online payment gateway integration is not included.

## Admin Access

Administrators can access the dashboard at:

```text
http://localhost:5173/admin
```

An admin account must be created using the backend admin setup script. Normal customer registration does not create an administrator account.

## Security

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based admin authorization.
- Environment variables for sensitive configuration.
- Git ignore rules to prevent committing secrets and dependencies.

## Future Improvements

- Online payment gateway integration.
- Product reviews and ratings.
- Wishlist functionality.
- Coupon and discount management.
- Email order notifications.
- Advanced sales analytics.

## Author

Developed as a full-stack web development project.

## License

This project is intended for educational and demonstration purposes.