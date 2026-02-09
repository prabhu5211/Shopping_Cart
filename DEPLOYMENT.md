# 🚀 Deployment Guide - Shopping Cart Application

## Prerequisites
- GitHub account
- MongoDB Atlas account (already setup)
- Vercel account (for frontend)
- Render/Railway account (for backend)

---

## 📦 Backend Deployment (Render.com - Free)

### Step 1: Push to GitHub
```bash
cd shopping-cart-app
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `prabhu5211/Shopping_Cart`
5. Configure:
   - **Name**: shopping-cart-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
In Render dashboard, add:
```
PORT=5000
MONGODB_URI=mongodb+srv://prabhukiran0977_db_user:mE3aVaSiLx9TnubE@cluster0.asbvzgh.mongodb.net/shopping-cart?retryWrites=true&w=majority
JWT_SECRET=shopping_cart_production_secret_2026
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Copy your backend URL: `https://shopping-cart-backend-xxxx.onrender.com`

---

## 🎨 Frontend Deployment (Vercel - Free)

### Step 1: Update API URLs
Before deploying, update all API URLs in frontend:

**Files to update:**
- `src/components/Login.jsx`
- `src/components/ItemList.jsx`
- `src/components/Cart.jsx`
- `src/components/Orders.jsx`
- `src/App.jsx`

Replace `http://localhost:5000` with your Render backend URL.

**OR** Create environment variable:
1. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Update code to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.get(`${API_URL}/api/items`)
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import `prabhu5211/Shopping_Cart`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables
In Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 4: Deploy
- Click "Deploy"
- Wait 1-2 minutes
- Your app is live! 🎉

---

## 🔧 Alternative: Railway (Backend)

1. Go to https://railway.app
2. Login with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select `Shopping_Cart` repo
5. Add environment variables
6. Deploy!

---

## 🔧 Alternative: Netlify (Frontend)

1. Go to https://netlify.com
2. "Add new site" → "Import from Git"
3. Select repo
4. Configure build settings
5. Deploy!

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Backend URL is accessible
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] API endpoints responding

### Frontend
- [ ] Frontend loads correctly
- [ ] Can login/signup
- [ ] Can add items to cart
- [ ] Can checkout
- [ ] Can view orders

### Testing
- [ ] Create new user
- [ ] Add items to cart
- [ ] Complete checkout
- [ ] View order history
- [ ] Test single-device login

---

## 🐛 Troubleshooting

### CORS Errors
Add to backend `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}));
```

### API Not Connecting
- Check backend URL in frontend code
- Verify environment variables
- Check browser console for errors

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Check connection string
- Ensure database user has permissions

---

## 📊 Monitoring

### Backend Logs
- Render: Dashboard → Logs
- Railway: Project → Deployments → Logs

### Frontend Logs
- Vercel: Project → Deployments → Function Logs
- Browser: F12 → Console

---

## 🔒 Security Notes

1. **Never commit `.env` files**
2. **Use strong JWT_SECRET in production**
3. **Enable MongoDB IP whitelist** (or use 0.0.0.0/0 for cloud deployments)
4. **Use HTTPS** (automatic on Vercel/Render)

---

## 💰 Cost

- **MongoDB Atlas**: Free (M0 tier)
- **Render**: Free (with sleep after inactivity)
- **Vercel**: Free (hobby plan)
- **Total**: $0/month 🎉

---

## 🎯 Your Live URLs

After deployment:
- **Frontend**: https://shopping-cart-xxxx.vercel.app
- **Backend**: https://shopping-cart-backend-xxxx.onrender.com
- **Database**: MongoDB Atlas (already setup)

---

## 📝 Notes

- Render free tier sleeps after 15 min inactivity (first request takes ~30s)
- Vercel has unlimited bandwidth on free tier
- MongoDB Atlas free tier: 512MB storage

---

## 🆘 Need Help?

Common issues:
1. **Backend not responding**: Check Render logs
2. **CORS errors**: Update CORS configuration
3. **Database errors**: Check MongoDB Atlas connection
4. **Frontend blank**: Check browser console

---

**Your app is ready to go live! 🚀**
