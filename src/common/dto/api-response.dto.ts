import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ description: 'Response data wrapped in Data tag' })
    Data: T;

    constructor(data: T) {
        this.Data = data;
    }
} 