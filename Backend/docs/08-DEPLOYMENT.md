# Deployment

## 🚀 Overview

Panduan lengkap untuk deploy Reluv Backend ke production environment.

## 📋 Prerequisites

- Server dengan Node.js 18+ installed
- PostgreSQL database
- Domain name (optional)
- SSL certificate (recommended)
- PM2 atau process manager lainnya

## 🔧 Production Setup

### 1. Environment Variables

Buat file `.env` di production server:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/reluv_db?schema=public"

# JWT
JWT_SECRET="your-production-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@reluv.com"

# OAuth (Production URLs)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://api.yourdomain.com/api/v1/auth/google/callback"

FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_CALLBACK_URL="https://api.yourdomain.com/api/v1/auth/facebook/callback"

# Midtrans (Production)
MIDTRANS_SERVER_KEY="your-production-server-key"
MIDTRANS_CLIENT_KEY="your-production-client-key"
MIDTRANS_IS_PRODUCTION=true

# Biteship
BITESHIP_API_KEY="your-biteship-api-key"
```

### 2. Build Application

```bash
npm install --production
npm run build
```

### 3. Database Migration

```bash
npx prisma migrate deploy
```

**⚠️ Jangan gunakan `migrate dev` di production!**

### 4. Generate Prisma Client

```bash
npx prisma generate
```

## 🖥 Process Management

### Using PM2

#### Install PM2

```bash
npm install -g pm2
```

#### Create PM2 Config

Buat file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'reluv-backend',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

#### Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs reluv-backend

# Restart
pm2 restart reluv-backend

# Stop
pm2 stop reluv-backend

# Monitor
pm2 monit
```

## 🌐 Nginx Configuration

### Reverse Proxy Setup

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## 🔒 Security Checklist

### 1. Environment Variables

- ✅ Jangan commit `.env` ke repository
- ✅ Gunakan strong secrets untuk JWT
- ✅ Rotate secrets secara berkala

### 2. Database

- ✅ Gunakan strong database password
- ✅ Limit database access (firewall)
- ✅ Enable SSL untuk database connection
- ✅ Regular backups

### 3. API Security

- ✅ Enable CORS dengan whitelist domain
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)

### 4. Server Security

- ✅ Keep Node.js updated
- ✅ Use firewall (UFW/iptables)
- ✅ Disable unnecessary services
- ✅ Regular security updates

## 📊 Monitoring

### Health Check Endpoint

```http
GET /api/v1
```

### Logging

Setup logging dengan Winston atau library lainnya:

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('App');

logger.log('Application started');
logger.error('Error occurred', error);
```

### Error Tracking

Integrate dengan error tracking service:

- Sentry
- Rollbar
- Bugsnag

## 🔄 CI/CD

### GitHub Actions Example

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
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: |
          # Your deployment script
```

## 📈 Performance Optimization

### 1. Enable Compression

Sudah diaktifkan di `main.ts`:

```typescript
app.use(compression());
```

### 2. Database Indexing

Pastikan indexes sudah dibuat di Prisma schema.

### 3. Caching

Consider menggunakan Redis untuk caching:

- Frequently accessed data
- Session storage
- Rate limiting

### 4. Load Balancing

Gunakan multiple instances dengan PM2 cluster mode atau load balancer.

## 🔄 Backup Strategy

### Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U username -d reluv_db > /backups/reluv_db_$DATE.sql
```

### Automated Backups

Setup cron job untuk automated backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

## 🚨 Troubleshooting

### Application Not Starting

1. Check logs: `pm2 logs reluv-backend`
2. Verify environment variables
3. Check database connection
4. Verify port availability

### Database Connection Issues

1. Check DATABASE_URL
2. Verify database is running
3. Check firewall rules
4. Test connection: `psql $DATABASE_URL`

### High Memory Usage

1. Check for memory leaks
2. Reduce PM2 instances
3. Enable memory limit restart
4. Monitor dengan `pm2 monit`

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Architecture](./02-ARCHITECTURE.md)
- [Database](./05-DATABASE.md)
