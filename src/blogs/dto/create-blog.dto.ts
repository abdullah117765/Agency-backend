
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';


    @ApiProperty({ description: 'The title of the blog ' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    title: string;


    @ApiProperty({ description: 'name of the author' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    author: string;


    @ApiProperty({ description: 'The description of the blog' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;


}












