# Vercel Deployment Guide for BEE1 Application

## Overview
This guide walks you through deploying your BEE1 Restaurant Management System to Vercel.

## Prerequisites
- GitHub account with your repository
- Vercel account (free tier available)
- MongoDB Atlas connection string in `.env`

## Step 1: Prepare Your Project

Your project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function entry point
- ✅ `.vercelignore` - Files to exclude from deployment

## Step 2: Push to GitHub

Make sure your code is on GitHub:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

**Important:** Make sure `.env` is NOT committed (should be in .gitignore)

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your GitHub repository
5. Click **Import**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Step 4: Set Environment Variables

After deployment starts:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

```

JWT_SECRET = your_jwt_secret_key_here

GEMINI_API_KEY = your_gemini_api_key_here

NODE_ENV = production
```

4. Click **Save**
5. Redeploy (Vercel will automatically redeploy with new env vars)

## Step 5: Configure MongoDB Atlas Network Access

Important: Allow Vercel's IP addresses to access your MongoDB Atlas cluster.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (for simplicity)
   - OR add Vercel's IP ranges (check Vercel docs for current ranges)
5. Click **Confirm**

**Note:** For production, it's better to whitelist specific Vercel regions. See MongoDB Atlas documentation.

## Step 6: Test Your Deployment

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

Test your API endpoints:
```bash
# Test health check
curl https://your-project.vercel.app/api/auth/health

# Test restaurants endpoint
curl https://your-project.vercel.app/api/restaurants
```

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Make sure all imports use correct relative paths. Check `api/index.js` and verify module paths.

### Issue: "Database connection timeout"
**Solution:** 
- Check MongoDB Atlas network access allows Vercel
- Verify MONGODB_URI is correct in environment variables
- Ensure database user has proper permissions

### Issue: "Static files not loading"
**Solution:**
- Static files are served from `public/` directory
- Check `vercel.json` routes configuration
- Verify files exist in `public/` directory

### Issue: "CORS errors"
**Solution:**
- CORS is already enabled in `app.js`
- If frontend is on different domain, update CORS origin in `app.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app']
}));
```

### Issue: "Build fails - multer configuration"
**Solution:**
- Multer upload directory must be in `/tmp` on Vercel
- Update `config/multer.js` to use temporary directory:
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : './public/uploads';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
```

## Important Notes for Production

### File Uploads
Vercel serverless functions have ephemeral storage. Uploaded files to `/tmp` won't persist between requests.

**Solution:** Use cloud storage (AWS S3, Cloudinary, etc.)
```javascript
// Option 1: AWS S3
// Option 2: Cloudinary
// Option 3: MongoDB GridFS for small files
```

### Database Connections
- Vercel creates new function instances frequently
- Database connection pooling is already configured in `config/database.js`
- Each serverless function instance maintains its own connection pool

### Scaling
- Vercel automatically scales based on traffic
- No manual server management needed
- Pay only for compute used

### Performance
- Cold start: ~1-2 seconds (first request to new instance)
- Warm start: <100ms (subsequent requests)
- Optimize with:
  - Reducing dependencies
  - Code splitting
  - Caching strategies

## Monitoring & Logs

1. Go to your Vercel project dashboard
2. Click **Logs** to see real-time logs
3. Check for errors and performance issues
4. Use [Vercel Analytics](https://vercel.com/analytics) for performance monitoring

## Deploying Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically:
1. Detect changes
2. Build your project
3. Run tests (if configured)
4. Deploy to production

## Rollback

If something goes wrong:
1. Go to Vercel dashboard
2. Click **Deployments**
3. Find the previous working deployment
4. Click the three dots menu
5. Select **Promote to Production**

## Domain Setup (Optional)

To use a custom domain:

1. In Vercel dashboard, click **Settings** → **Domains**
2. Enter your domain name
3. Add DNS records (Vercel provides instructions)
4. Wait for DNS propagation (can take up to 48 hours)

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Import project to Vercel
3. ✅ Set environment variables
4. ✅ Configure MongoDB Atlas network access
5. ✅ Test your deployed application
6. ✅ Monitor logs for errors

## Helpful Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/concepts/functions/serverless-functions/node)
- [Vercel Deployment Troubleshooting](https://vercel.com/docs/platform/frequently-asked-questions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Questions?** Check logs in Vercel dashboard or contact Vercel support.
