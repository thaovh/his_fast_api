import { Controller, Get, Query, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { TreatmentService } from '../services/treatment.service';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { parseInputDate } from '../utils/date.util';

@ApiTags('treatments')
@Controller('treatments')
@UseGuards(ApiKeyGuard)
@ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
})
export class TreatmentController {
    constructor(private readonly treatmentService: TreatmentService) { }

    @Get()
    @ApiOperation({ summary: 'Get treatments by time range' })
    @ApiQuery({
        name: 'timeFrom',
        required: true,
        description: 'Start time in format DD/MM/YYYY HH:mm:ss (e.g., 17/04/2025 00:00:00)',
        example: '17/04/2025 00:00:00'
    })
    @ApiQuery({
        name: 'timeTo',
        required: true,
        description: 'End time in format DD/MM/YYYY HH:mm:ss (e.g., 17/04/2025 23:59:59)',
        example: '17/04/2025 23:59:59'
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns treatments within the specified time range' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid time range parameters' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid API key' })
    async getTreatmentsByTimeRange(
        @Query('timeFrom') timeFrom: string,
        @Query('timeTo') timeTo: string,
    ) {
        try {
            const fromDate = parseInputDate(timeFrom);
            const toDate = parseInputDate(timeTo);

            const treatments = await this.treatmentService.getTreatmentsByTimeRange(fromDate, toDate);
            return treatments;
        } catch (error) {
            if (error.message.includes('Invalid date format')) {
                throw new HttpException('Invalid date format. Expected format: DD/MM/YYYY HH:mm:ss', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 