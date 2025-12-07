# Deployment Plan
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan rencana deployment untuk platform Reluv App, termasuk environment setup, deployment process, dan rollback strategy.

### 1.2 Deployment Environments

- **Development**: Local development
- **Staging**: Testing environment
- **Production**: Live environment

---

## 2. DEPLOYMENT ARCHITECTURE

### 2.1 Frontend Deployment

**Platform**: Vercel

**Configuration**:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: 18.x

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://api.reluv.app/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### 2.2 Backend Deployment

**Platform**: Railway atau Render

**Configuration**:
- Runtime: Node.js 18+
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`
- Port: 8000

**Environment Variables**:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
MIDTRANS_SERVER_KEY=your-server-key
BITESHIP_API_KEY=your-api-key
```

### 2.3 Database

**Platform**: Managed PostgreSQL (Railway/Render/Supabase)

**Configuration**:
- Version: PostgreSQL 14+
- Connection pooling enabled
- Automated backups
- Point-in-time recovery

---

## 3. DEPLOYMENT PROCESS

### 3.1 Pre-Deployment Checklist

- [ ] All tests passed
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Third-party services configured
- [ ] SSL certificates ready
- [ ] Domain configured

### 3.2 Deployment Steps

#### Step 1: Database Migration

```bash
# Run migrations on staging/production
npx prisma migrate deploy
```

#### Step 2: Backend Deployment

1. Push code to repository
2. Trigger deployment (automatic atau manual)
3. Wait for build completion
4. Verify health check endpoint

#### Step 3: Frontend Deployment

1. Push code to repository
2. Vercel automatically builds and deploys
3. Verify deployment URL
4. Test critical user flows

#### Step 4: Post-Deployment Verification

- [ ] Health check endpoints responding
- [ ] Database connections working
- [ ] API endpoints accessible
- [ ] Frontend loading correctly
- [ ] Authentication working
- [ ] Payment integration working
- [ ] Shipping integration working

---

## 4. CI/CD PIPELINE

### 4.1 GitHub Actions Workflow

**Workflow File**: `.github/workflows/deploy.yml`

**Steps**:
1. **Checkout**: Get latest code
2. **Setup Node**: Install Node.js
3. **Install Dependencies**: `npm install`
4. **Run Tests**: Unit dan integration tests
5. **Build**: Build application
6. **Deploy**: Deploy to staging/production

### 4.2 Deployment Triggers

- **Staging**: Push to `develop` branch
- **Production**: Push to `main` branch atau manual trigger

---

## 5. ENVIRONMENT CONFIGURATION

### 5.1 Development Environment

**Frontend**:
- URL: `http://localhost:3099`
- API: `http://localhost:8000/api/v1`

**Backend**:
- Port: 8000
- Database: Local PostgreSQL

### 5.2 Staging Environment

**Frontend**:
- URL: `https://staging.reluv.app`
- API: `https://api-staging.reluv.app/api/v1`

**Backend**:
- URL: `https://api-staging.reluv.app`
- Database: Staging PostgreSQL

### 5.3 Production Environment

**Frontend**:
- URL: `https://reluv.app`
- API: `https://api.reluv.app/api/v1`

**Backend**:
- URL: `https://api.reluv.app`
- Database: Production PostgreSQL

---

## 6. ROLLBACK STRATEGY

### 6.1 Rollback Triggers

- Critical bugs ditemukan
- Performance degradation
- Security issues
- Data corruption

### 6.2 Rollback Process

#### Frontend Rollback (Vercel)

1. Buka Vercel dashboard
2. Pilih deployment sebelumnya
3. Click "Promote to Production"
4. Verify rollback successful

#### Backend Rollback

1. Revert code ke commit sebelumnya
2. Trigger deployment
3. Verify rollback successful

#### Database Rollback

1. Restore dari backup
2. Run reverse migrations (jika perlu)
3. Verify data integrity

---

## 7. MONITORING AND ALERTS

### 7.1 Application Monitoring

- **Uptime Monitoring**: UptimeRobot atau similar
- **Error Tracking**: Sentry
- **Performance Monitoring**: Vercel Analytics, Railway Metrics

### 7.2 Alerts

- **Uptime**: Alert jika downtime > 5 menit
- **Errors**: Alert untuk critical errors
- **Performance**: Alert jika response time > 2 detik

---

## 8. SECURITY CONSIDERATIONS

### 8.1 SSL/TLS

- HTTPS enabled untuk semua environments
- SSL certificates auto-renewal
- HSTS headers configured

### 8.2 Environment Variables

- Stored securely di platform
- Never committed to repository
- Rotated regularly

### 8.3 Database Security

- Connection encryption
- Access restricted by IP
- Regular security updates

---

## 9. BACKUP STRATEGY

### 9.1 Database Backups

- **Frequency**: Daily
- **Retention**: 30 days
- **Location**: Cloud storage
- **Testing**: Monthly restore test

### 9.2 Code Backups

- **Version Control**: Git repository
- **Remote**: GitHub/GitLab
- **Branches**: Multiple branches untuk safety

---

## 10. POST-DEPLOYMENT

### 10.1 Smoke Testing

- Test critical user flows
- Verify integrations
- Check error logs

### 10.2 Monitoring

- Monitor error rates
- Monitor performance metrics
- Monitor user feedback

### 10.3 Documentation

- Update deployment documentation
- Document any issues encountered
- Update runbooks

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - Deployment Plan

