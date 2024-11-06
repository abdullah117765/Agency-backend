


import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateTestimonialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';

    @ApiProperty({ description: 'The full name the person  writing the testimonial' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    fullName: string;

    @ApiProperty({ description: 'The description of the testimonial' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(400)
    description: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;


}

