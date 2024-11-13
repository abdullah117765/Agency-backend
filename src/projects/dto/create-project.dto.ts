// src/projects/dto/create-project.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateProjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';


    @ApiProperty({ description: 'The title of the project' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    title: string;

    @ApiProperty({ description: 'The description of the project' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(2000)
    description: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;


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

    @ApiProperty({ required: false })
    @IsIn(['active'])
    @IsOptional()
    status: string;

}


// DTO for the params
export class statusDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    status: string;
}