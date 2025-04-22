import { Controller, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TreatmentService } from './treatment.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { TreatmentDto } from './dto/treatment.dto';

@ApiTags('treatments')
@ApiBearerAuth('access-token')
@Controller('treatments')
export class TreatmentController {
    constructor(private readonly treatmentService: TreatmentService) { }

    @Get()
    @ApiOperation({
        summary: 'Get treatments by time range',
        description: 'Retrieves treatment records within the specified time range'
    })
    @ApiQuery({
        name: 'timeFrom',
        required: true,
        description: 'Start time in format YYYY-MM-DD HH:MM:SS',
        example: '2023-01-01 00:00:00'
    })
    @ApiQuery({
        name: 'timeTo',
        required: true,
        description: 'End time in format YYYY-MM-DD HH:MM:SS',
        example: '2023-01-31 23:59:59'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns treatments within the specified time range',
        type: () => ApiResponseDto<TreatmentDto[]>
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters',
        schema: {
            example: {
                statusCode: 400,
                message: 'Time range parameters are required',
                error: 'Bad Request'
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error'
            }
        }
    })
    async getTreatmentsByTimeRange(
        @Query('timeFrom') timeFrom: string,
        @Query('timeTo') timeTo: string,
    ): Promise<ApiResponseDto<TreatmentDto[]>> {
        try {
            if (!timeFrom || !timeTo) {
                throw new HttpException('Time range parameters are required', HttpStatus.BAD_REQUEST);
            }
            const result = await this.treatmentService.getTreatmentsByTimeRange(timeFrom, timeTo);
            return new ApiResponseDto(result);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 