import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpStatus, HttpException, BadRequestException, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DynamicService } from './dynamic.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';

@ApiTags('dynamic')
@ApiBearerAuth('access-token')
@Controller('dynamic')
@UseGuards(ApiKeyGuard, RateLimitGuard)
export class DynamicController {
    constructor(private readonly dynamicService: DynamicService) { }

    @Get(':endpoint')
    @ApiOperation({
        summary: 'Dynamic GET endpoint',
        description: 'Executes SQL query from file based on endpoint name'
    })
    @ApiParam({
        name: 'endpoint',
        description: 'Endpoint name (matches SQL file name)',
        example: 'his_treatment'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns query results'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters'
    })
    @ApiResponse({
        status: 404,
        description: 'Endpoint not found'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async handleGet(
        @Param('endpoint') endpoint: string,
        @Query() queryParams: any
    ): Promise<ApiResponseDto<any>> {
        try {
            if (!endpoint) {
                throw new BadRequestException('Endpoint name is required');
            }

            const result = await this.dynamicService.executeQuery(endpoint, 'GET', queryParams);
            return new ApiResponseDto(result);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            if (error.message.includes('not found')) {
                throw new NotFoundException(error.message);
            }

            if (error.message.includes('Invalid SQL')) {
                throw new BadRequestException(error.message);
            }

            throw new InternalServerErrorException(`Error executing query: ${error.message}`);
        }
    }

    @Post(':endpoint')
    @ApiOperation({
        summary: 'Dynamic POST endpoint',
        description: 'Executes SQL query from file based on endpoint name'
    })
    @ApiParam({
        name: 'endpoint',
        description: 'Endpoint name (matches SQL file name)',
        example: 'his_treatment'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns query results'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters'
    })
    @ApiResponse({
        status: 404,
        description: 'Endpoint not found'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async handlePost(
        @Param('endpoint') endpoint: string,
        @Body() body: any
    ): Promise<ApiResponseDto<any>> {
        try {
            if (!endpoint) {
                throw new BadRequestException('Endpoint name is required');
            }

            const result = await this.dynamicService.executeQuery(endpoint, 'POST', body);
            return new ApiResponseDto(result);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            if (error.message.includes('not found')) {
                throw new NotFoundException(error.message);
            }

            if (error.message.includes('Invalid SQL')) {
                throw new BadRequestException(error.message);
            }

            throw new InternalServerErrorException(`Error executing query: ${error.message}`);
        }
    }
} 