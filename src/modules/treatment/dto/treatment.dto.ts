import { ApiProperty } from '@nestjs/swagger';

export class TreatmentDto {
    @ApiProperty({ description: 'Treatment ID' })
    ID: string;

    @ApiProperty({ description: 'Treatment Name' })
    Name: string;
} 