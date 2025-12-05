# Troubleshooting

## 🔧 Common Issues and Solutions

### Database Issues

#### Connection Refused

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   
   # Windows
   # Check Services
   ```

2. Verify DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/reluv_db"
   ```

3. Check PostgreSQL port:
   ```bash
   # Default port is 5432
   netstat -an | grep 5432
   ```

#### Migration Errors

**Error:**
```
Migration failed
```

**Solutions:**
1. Check migration status:
   ```bash
   npx prisma migrate status
   ```

2. Reset migrations (⚠️ WARNING: deletes data):
   ```bash
   npx prisma migrate reset
   ```

3. Create new migration:
   ```bash
   npx prisma migrate dev --name fix_migration
   ```

#### Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
npx prisma generate
```

### Server Issues

#### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::8000
```

**Solutions:**

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Or change port in `.env`:**
```env
PORT=8001
```

#### Application Won't Start

**Check:**
1. Environment variables are set correctly
2. Dependencies installed: `npm install`
3. Database is accessible
4. Check logs for specific errors

### Authentication Issues

#### Invalid Token

**Error:**
```
Unauthorized
```

**Solutions:**
1. Verify token is included in header:
   ```
   Authorization: Bearer <token>
   ```

2. Check token expiration
3. Re-login to get new token

#### Token Expired

**Solution:**
Login again to get new token, atau implement refresh token mechanism.

### Validation Errors

#### Validation Failed

**Error:**
```
Validation failed
```

**Solutions:**
1. Check request body matches DTO structure
2. Verify required fields are provided
3. Check field types (string, number, etc.)
4. Review validation rules in DTO

### File Upload Issues

#### Cloudinary Upload Failed

**Error:**
```
Failed to upload image
```

**Solutions:**
1. Verify Cloudinary credentials in `.env`
2. Check file size limits
3. Verify file format is supported
4. Check network connection

### Email Issues

#### Email Not Sending

**Solutions:**
1. Verify email credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check SMTP settings
4. Verify EMAIL_FROM is set correctly

### CORS Issues

#### CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**
1. Check FRONTEND_URL in `.env`:
   ```env
   FRONTEND_URL=http://localhost:3099
   ```

2. Verify CORS is enabled in `main.ts`
3. Check frontend is using correct API URL

### Performance Issues

#### Slow Queries

**Solutions:**
1. Add database indexes:
   ```prisma
   @@index([categoryId])
   ```

2. Use Prisma select untuk limit fields:
   ```typescript
   select: {
     id: true,
     name: true,
   }
   ```

3. Implement pagination
4. Use database connection pooling

#### High Memory Usage

**Solutions:**
1. Check for memory leaks
2. Limit concurrent requests
3. Use PM2 dengan memory limit
4. Monitor dengan `pm2 monit`

### Build Issues

#### Build Fails

**Error:**
```
Type errors
```

**Solutions:**
1. Check TypeScript errors:
   ```bash
   npm run build
   ```

2. Fix type errors
3. Verify all imports are correct
4. Check Prisma client is generated

## 🐛 Debugging Tips

### Enable Debug Logging

Set di `.env`:
```env
NODE_ENV=development
```

### Check Logs

**PM2:**
```bash
pm2 logs reluv-backend
```

**Console:**
Check console output saat development.

### Use Prisma Studio

```bash
npx prisma studio
```

Untuk inspect database data.

### Test Endpoints

Use Postman atau curl untuk test endpoints:

```bash
curl http://localhost:8000/api/v1
```

## 📞 Getting Help

### Check Documentation

1. [Getting Started](./01-GETTING-STARTED.md)
2. [Architecture](./02-ARCHITECTURE.md)
3. [API Reference](./03-API-REFERENCE.md)

### Common Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Create Issue

Jika masalah belum teratasi:
1. Check existing issues
2. Create new issue dengan:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs (jika ada)

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Deployment](./08-DEPLOYMENT.md)
- [Database](./05-DATABASE.md)

