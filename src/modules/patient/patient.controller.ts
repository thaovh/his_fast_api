import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientController {
    @Get()
    @ApiOperation({
        summary: 'Get all patients',
        description: 'Retrieves a list of all patients with pagination'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number',
        example: 1
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        example: 10
    })
    @ApiResponse({
        status: 200,
        description: 'Returns list of patients'
    })
    async getAllPatients(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        // Implementation will be added later
        return new ApiResponseDto([]);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get patient by ID',
        description: 'Retrieves patient information by ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Patient ID',
        example: '12345'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns patient information'
    })
    async getPatientById(@Param('id') id: string) {
        // Implementation will be added later
        return new ApiResponseDto({});
    }

    @Get(':id/treatments')
    @ApiOperation({
        summary: 'Get patient treatments',
        description: 'Retrieves treatment history for a specific patient'
    })
    @ApiParam({
        name: 'id',
        description: 'Patient ID',
        example: '12345'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns patient treatment history'
    })
    async getPatientTreatments(@Param('id') id: string) {
        // Implementation will be added later
        return new ApiResponseDto([]);
    }
} 