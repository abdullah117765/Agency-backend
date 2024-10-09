// src/services/dto/create-service.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateServiceDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';


    @ApiProperty({ description: 'The title of the service' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    title: string;

    @ApiProperty({ description: 'The description of the service' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(127)
    description: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;

    @ApiProperty({ description: 'The price of the service' })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    price: number;


}


export class PaginationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    page: number = 1;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    pageSize: number = 6;

}


// DTO for the params
export class statusDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    status: string;
}