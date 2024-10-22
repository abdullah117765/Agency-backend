

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateContactDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    fullName: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(120)
    message: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    phone: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

}


