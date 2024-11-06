


import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class CreateQuoteDto {

    @ApiProperty({ description: 'First name' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    firstName: string;


    @ApiProperty({ description: 'Last name ' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    lastName: string;


    @ApiProperty({ description: 'phone number' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    phone: string;


    @ApiProperty({ description: 'email ' })
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @ApiProperty({ description: 'Services' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(400)
    services: string;


    @ApiProperty({ description: 'comment ' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(400)
    comments: string;


    @ApiProperty({ description: 'NoOfServices' })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    NoOfServices: number;


}


