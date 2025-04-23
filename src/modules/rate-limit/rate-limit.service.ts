import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RateLimitInfo {
    count: number;
    resetTime: number;
}

@Injectable()
export class RateLimitService {
    private readonly logger = new Logger(RateLimitService.name);
    private readonly windowMs: number;
    private readonly maxRequests: number;
    private readonly rateLimits: Map<string, RateLimitInfo> = new Map();

    constructor(private readonly configService: ConfigService) {
        this.windowMs = this.configService.get<number>('RATE_LIMIT_WINDOW_MS') || 60000;
        this.maxRequests = this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS') || 100;
        this.logger.log(`Rate limit configured: ${this.maxRequests} requests per ${this.windowMs}ms`);
    }

    isRateLimited(ip: string, endpoint: string): boolean {
        const key = `${ip}:${endpoint}`;
        const now = Date.now();

        // Get or create rate limit info for this IP and endpoint
        let rateLimitInfo = this.rateLimits.get(key);

        if (!rateLimitInfo) {
            // First request from this IP to this endpoint
            rateLimitInfo = {
                count: 1,
                resetTime: now + this.windowMs,
            };
            this.rateLimits.set(key, rateLimitInfo);
            return false;
        }

        // Check if the window has expired
        if (now > rateLimitInfo.resetTime) {
            // Reset the counter for a new window
            rateLimitInfo.count = 1;
            rateLimitInfo.resetTime = now + this.windowMs;
            return false;
        }

        // Increment the counter
        rateLimitInfo.count++;

        // Check if the limit has been exceeded
        if (rateLimitInfo.count > this.maxRequests) {
            this.logger.warn(`Rate limit exceeded for ${key}: ${rateLimitInfo.count} requests`);
            return true;
        }

        return false;
    }

    // Clean up expired rate limits periodically
    cleanup(): void {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, info] of this.rateLimits.entries()) {
            if (now > info.resetTime) {
                this.rateLimits.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            this.logger.debug(`Cleaned up ${cleaned} expired rate limits`);
        }
    }
} 