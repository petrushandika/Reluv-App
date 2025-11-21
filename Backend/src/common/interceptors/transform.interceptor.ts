import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import {
  ApiResponse,
  PaginatedResponse,
} from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // If data is already a paginated response, return it as is
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            statusCode,
            message: 'Data retrieved successfully',
            ...data,
            timestamp: new Date().toISOString(),
            path: request.url,
          } as PaginatedResponse<T>;
        }

        // Standard response
        return {
          success: true,
          statusCode,
          message: this.getSuccessMessage(request.method, statusCode),
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        } as ApiResponse<T>;
      }),
    );
  }

  private getSuccessMessage(method: string, statusCode: number): string {
    if (statusCode === 201) {
      return 'Resource created successfully';
    }
    if (statusCode === 200) {
      switch (method) {
        case 'GET':
          return 'Data retrieved successfully';
        case 'PATCH':
        case 'PUT':
          return 'Resource updated successfully';
        case 'DELETE':
          return 'Resource deleted successfully';
        case 'POST':
          return 'Operation completed successfully';
        default:
          return 'Request processed successfully';
      }
    }
    return 'Request processed successfully';
  }
}
