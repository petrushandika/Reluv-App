import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimitMap = new Map<string, RateLimitEntry>();
  private readonly windowMs = 30000;
  private readonly maxRequests = 1;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email = request.body?.email;
    const token = request.body?.token;
    const identifier = email || token || request.ip;
    const key = `rate_limit_${identifier}`;

    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (entry) {
      const timeSinceFirstRequest = now - entry.timestamp;

      if (timeSinceFirstRequest < this.windowMs) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Please wait 30 seconds before making another request.',
            retryAfter: Math.ceil((this.windowMs - timeSinceFirstRequest) / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      this.rateLimitMap.delete(key);
    }

    this.rateLimitMap.set(key, {
      timestamp: now,
      count: 1,
    });

    setTimeout(() => {
      this.rateLimitMap.delete(key);
    }, this.windowMs);

    return true;
  }
}

