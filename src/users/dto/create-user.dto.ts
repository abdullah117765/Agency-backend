// src/services/dto/create-service.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';


    @ApiProperty({ description: 'Full name of the servicuser' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    fullname: string;

    @ApiProperty({ description: 'role of the user' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    role: string;

    @ApiProperty({ description: 'email of the user' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;


    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;

    @ApiProperty({ description: 'role of the user' })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @ApiProperty({ description: 'role of the user' })
    @IsOptional()
    @IsString()
    twitter: string;

    @ApiProperty({ description: 'role of the user' })
    @IsOptional()
    @IsString()
    instagram: string;

    @ApiProperty({ description: 'role of the user' })
    @IsOptional()
    @IsString()
    linkedin: string;
}



