# Deployment

## 🚀 Overview

Panduan lengkap untuk deploy Reluv Frontend ke production environment.

## 📋 Prerequisites

- Node.js 18+ installed
- Build tools (npm/yarn)
- Deployment platform account (Vercel, Netlify, etc.)
- Environment variables configured

## 🔧 Production Build

### 1. Build Application

```bash
npm run build
```

Ini akan:

- Compile TypeScript
- Optimize images
- Generate static pages
- Create production bundle

### 2. Test Production Build Locally

```bash
npm run build
npm run start
```

Visit `http://localhost:3099` untuk test production build.

## 🌐 Deployment Options

### Vercel (Recommended)

Vercel adalah platform yang optimal untuk Next.js applications.

#### Setup

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Production Deploy**

```bash
vercel --prod
```

#### Environment Variables

Set di Vercel dashboard:

- `NEXT_PUBLIC_API_URL`
- Other required variables

#### Automatic Deployments

Connect GitHub repository untuk automatic deployments:

- Push to `main` → Production
- Push to other branches → Preview

### Netlify

#### Setup

1. **Install Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **Deploy**

```bash
netlify deploy
netlify deploy --prod
```

#### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Self-Hosted

#### Using PM2

```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "reluv-frontend" -- start
pm2 save
pm2 startup
```

#### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3099

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t reluv-frontend .
docker run -p 3099:3099 reluv-frontend
```

## ⚙️ Environment Variables

### Production Variables

Set di deployment platform:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Security

- ✅ Jangan expose sensitive keys di `NEXT_PUBLIC_*`
- ✅ Use server-side variables untuk sensitive data
- ✅ Rotate keys secara berkala

## 🔒 Security Checklist

### 1. Environment Variables

- ✅ Set all required variables
- ✅ Don't commit `.env.local`
- ✅ Use secure values

### 2. API Security

- ✅ Use HTTPS untuk API calls
- ✅ Verify CORS settings
- ✅ Implement rate limiting (if needed)

### 3. Content Security

- ✅ Sanitize user input
- ✅ Validate all inputs
- ✅ Use HTTPS

## 📊 Performance Optimization

### 1. Image Optimization

Next.js Image component automatically optimizes:

```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>;
```

### 2. Code Splitting

Next.js automatically code splits:

- Route-based splitting
- Dynamic imports
- Component-level splitting

### 3. Caching

- Static pages: Cached by default
- API routes: Implement caching headers
- Images: CDN caching

### 4. Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

## 🔍 Monitoring

### Error Tracking

Integrate dengan error tracking service:

- Sentry
- LogRocket
- Bugsnag

### Analytics

Add analytics:

- Google Analytics
- Vercel Analytics
- Custom analytics

## 🔄 CI/CD

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

## 🚨 Troubleshooting

### Build Fails

1. Check TypeScript errors
2. Verify all dependencies installed
3. Check environment variables
4. Review build logs

### Runtime Errors

1. Check browser console
2. Verify API connectivity
3. Check environment variables
4. Review error logs

### Performance Issues

1. Analyze bundle size
2. Check image optimization
3. Review API response times
4. Monitor Core Web Vitals

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Architecture](./02-ARCHITECTURE.md)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
