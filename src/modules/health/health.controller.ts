import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({
        summary: 'Health check endpoint',
        description: 'Returns a simple message to verify the API is running'
    })
    @ApiResponse({
        status: 200,
        description: 'Application is healthy',
        type: () => ApiResponseDto<string>,
        schema: {
            example: {
                Data: 'Hello'
            }
        }
    })
    healthCheck(): ApiResponseDto<string> {
        return new ApiResponseDto<string>('Hello');
    }
} 