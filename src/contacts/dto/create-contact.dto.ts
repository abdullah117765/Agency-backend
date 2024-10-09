

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateContactDto {

    @ApiProperty({ description: 'First name' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    fullName: string;


    @ApiProperty({ description: 'Last name ' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(120)
    message: string;


    @ApiProperty({ description: 'phone number' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    phone: string;


    @ApiProperty({ description: 'email ' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

}


