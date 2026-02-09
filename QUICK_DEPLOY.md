# ⚡ Quick Deploy Guide (5 Minutes)

## 🎯 Fastest Way to Deploy

### Step 1: Backend on Render (2 min)
1. Go to https://render.com/deploy
2. Click "New +" → "Web Service"
3. Connect GitHub: `prabhu5211/Shopping_Cart`
4. Settings:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://prabhukiran0977_db_user:mE3aVaSiLx9TnubE@cluster0.asbvzgh.mongodb.net/shopping-cart
   JWT_SECRET=shopping_cart_secret_2026
   ```
6. Click "Create" → Copy URL

### Step 2: Update Frontend API URL (1 min)
Replace in ALL frontend files:
```javascript
// OLD:
'http://localhost:5000'

// NEW:
'https://YOUR-RENDER-URL.onrender.com'
```

Files to update:
- `frontend/src/components/Login.jsx` (3 places)
- `frontend/src/components/ItemList.jsx` (2 places)
- `frontend/src/components/Cart.jsx` (3 places)
- `frontend/src/components/Orders.jsx` (1 place)
- `frontend/src/App.jsx` (1 place)

### Step 3: Frontend on Vercel (2 min)
1. Go to https://vercel.com/new
2. Import `prabhu5211/Shopping_Cart`
3. Settings:
   - Root: `frontend`
   - Framework: Vite
4. Click "Deploy"
5. Done! 🎉

---

## 🔗 Your Live App
- Frontend: `https://shopping-cart-xxxx.vercel.app`
- Backend: `https://shopping-cart-backend-xxxx.onrender.com`

---

## ✅ Test Your Live App
1. Open frontend URL
2. Login: testuser / password123
3. Add items to cart
4. Checkout
5. View orders

**That's it! Your app is LIVE! 🚀**
