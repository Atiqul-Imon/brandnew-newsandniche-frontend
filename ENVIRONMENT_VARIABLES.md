# Frontend Environment Variables Guide

## 🚀 Required Environment Variables for Render Deployment

### Core Variables (Already in render.yaml)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `NODE_OPTIONS` | `--max-old-space-size=512` | Memory limit for Node.js |
| `NEXT_PUBLIC_APP_ENV` | `production` | Application environment |
| `NEXT_PUBLIC_SITE_URL` | `https://newsandniche.com` | Your website URL |

### Required Variables (Set in Render Dashboard)

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://brandnew-nesandniche-backend.onrender.com` | Backend API URL | ✅ Yes |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics ID | ❌ Optional |
| `NEXT_PUBLIC_ADSENSE_ID` | `ca-pub-XXXXXXXXXX` | Google AdSense ID | ❌ Optional |

## 🔧 How to Set Environment Variables in Render

### Method 1: Render Dashboard
1. Go to your Render dashboard
2. Select your frontend service (`newsandniche-frontend`)
3. Go to **Environment** tab
4. Add the variables listed above
5. Click **Save Changes**

### Method 2: Render CLI (Alternative)
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Set environment variables
render env set NEXT_PUBLIC_API_BASE_URL=https://brandnew-nesandniche-backend.onrender.com
render env set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
render env set NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

## 📋 Environment Variables by Environment

### Development (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# AdSense (Optional - Add after approval)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Render Dashboard)
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://brandnew-nesandniche-backend.onrender.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# AdSense (Optional - Add after approval)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://newsandniche.com

# Memory Optimization
NODE_OPTIONS=--max-old-space-size=512
NODE_ENV=production
```

## 🔍 How to Get Required Values

### 1. Backend API URL
- Your backend is deployed at: `https://brandnew-nesandniche-backend.onrender.com`
- This is already configured in your render.yaml

### 2. Google Analytics ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get the Measurement ID (format: G-XXXXXXXXXX)
4. Add it to Render environment variables

### 3. Google AdSense ID
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Apply for AdSense (if not already approved)
3. Get your Publisher ID (format: ca-pub-XXXXXXXXXX)
4. Add it to Render environment variables

## ⚠️ Important Notes

### Security
- **Never commit sensitive values** to git
- Use Render's environment variable system
- All `NEXT_PUBLIC_*` variables are exposed to the browser

### Memory Optimization
- `NODE_OPTIONS=--max-old-space-size=512` is crucial for preventing memory leaks
- This limits Node.js memory usage to 512MB

### Performance
- Set `NODE_ENV=production` for optimal performance
- Use `NEXT_PUBLIC_APP_ENV=production` for production-specific features

## 🚨 Troubleshooting

### Common Issues

#### 1. API Connection Errors
```bash
# Check if backend URL is correct
NEXT_PUBLIC_API_BASE_URL=https://brandnew-nesandniche-backend.onrender.com
```

#### 2. Memory Issues
```bash
# Ensure memory limit is set
NODE_OPTIONS=--max-old-space-size=512
```

#### 3. Analytics Not Working
```bash
# Check if GA ID is correct
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### 4. AdSense Not Loading
```bash
# Check if AdSense ID is correct
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

### Verification Commands
```bash
# Check environment variables in browser
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
console.log(process.env.NEXT_PUBLIC_GA_ID);
console.log(process.env.NEXT_PUBLIC_ADSENSE_ID);
```

## 📊 Monitoring

### Render Dashboard
- Monitor memory usage in Render dashboard
- Check deployment logs for errors
- Verify environment variables are loaded

### Browser Console
```javascript
// Check if variables are loaded
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('GA ID:', process.env.NEXT_PUBLIC_GA_ID);
console.log('AdSense ID:', process.env.NEXT_PUBLIC_ADSENSE_ID);
```

## 🔄 Deployment Checklist

Before deploying, ensure:

- [ ] `NEXT_PUBLIC_API_BASE_URL` is set to your backend URL
- [ ] `NODE_OPTIONS=--max-old-space-size=512` is set
- [ ] `NODE_ENV=production` is set
- [ ] `NEXT_PUBLIC_APP_ENV=production` is set
- [ ] `NEXT_PUBLIC_SITE_URL` is set to your domain
- [ ] Optional: `NEXT_PUBLIC_GA_ID` is set (if using analytics)
- [ ] Optional: `NEXT_PUBLIC_ADSENSE_ID` is set (if using ads)

## 🆘 Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables in Render dashboard
3. Test API connectivity
4. Monitor memory usage
5. Check browser console for errors 