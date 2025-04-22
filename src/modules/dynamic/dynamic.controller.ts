import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DynamicService } from './dynamic.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('dynamic')
@ApiBearerAuth('access-token')
@Controller('dynamic')
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
    async handleGet(
        @Param('endpoint') endpoint: string,
        @Query() queryParams: any
    ): Promise<ApiResponseDto<any>> {
        try {
            const result = await this.dynamicService.executeQuery(endpoint, 'GET', queryParams);
            return new ApiResponseDto(result);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
    async handlePost(
        @Param('endpoint') endpoint: string,
        @Body() body: any
    ): Promise<ApiResponseDto<any>> {
        try {
            const result = await this.dynamicService.executeQuery(endpoint, 'POST', body);
            return new ApiResponseDto(result);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 