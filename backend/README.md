# Shopping Cart Backend

## Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

## Deployment

### Railway / Render / Heroku

1. Set environment variables in dashboard
2. Deploy from GitHub
3. Backend will run on assigned port

### Important
- DO NOT run `seed.js` in production
- It will delete all data!
