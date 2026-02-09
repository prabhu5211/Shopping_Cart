# 🛒 Shopping Cart - Full Stack E-commerce Application

A modern, full-stack shopping cart application with user authentication, cart management, and order processing.

## ✨ Features

- 🔐 User Authentication (JWT)
- 🔒 Single-device login enforcement
- 🛍️ Product browsing with images
- 🛒 Shopping cart with quantity management
- 📦 Order history
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design
- 🔔 Toast notifications

## 🚀 Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Lucide React Icons

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy: See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

## 🔑 Default Credentials

```
Username: testuser
Password: password123
```

## 📸 Screenshots

- Login/Signup screen with gradient design
- Product grid with images
- Shopping cart with quantity controls
- Order history with item details

## 🛠️ API Endpoints

### User Routes
- `POST /api/users` - Create user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `GET /api/users` - List users

### Item Routes
- `POST /api/items` - Create item
- `GET /api/items` - List items

### Cart Routes (Protected)
- `POST /api/carts` - Add to cart
- `GET /api/carts` - Get cart
- `PUT /api/carts/:id` - Update quantity
- `DELETE /api/carts/:id` - Remove item

### Order Routes (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders

## 👨‍💻 Author

Prabhu Kiran

## 📄 License

MIT

## 🙏 Acknowledgments

- ABCDE Ventures Assignment
- Unsplash for product images
