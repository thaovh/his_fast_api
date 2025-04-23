import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly rateLimitService: RateLimitService,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // Check if rate limiting is enabled
        const isEnabled = this.configService.get<boolean>('RATE_LIMIT_ENABLED');
        if (!isEnabled) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const ip = this.getClientIp(request);
        const endpoint = this.getEndpoint(request);

        // Check if the request should be rate limited
        const isLimited = this.rateLimitService.isRateLimited(ip, endpoint);
        if (isLimited) {
            throw new HttpException(
                'Too Many Requests',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return true;
    }

    private getClientIp(request: any): string {
        // Try to get the real IP address from various headers
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            return forwardedFor.split(',')[0].trim();
        }
        return request.ip || request.connection.remoteAddress;
    }

    private getEndpoint(request: any): string {
        // Get the endpoint path for rate limiting
        return request.route.path;
    }
} 