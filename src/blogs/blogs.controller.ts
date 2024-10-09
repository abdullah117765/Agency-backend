import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto, statusDto } from 'src/services/dto/create-service.dto';
import { UpdateServiceDto } from 'src/services/dto/update-service.dto';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }


  @Patch('status/:id')
  @ApiOperation({ summary: 'Update a status by ID' })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: statusDto,
  ) {
    return this.blogsService.updateStatus(id, status);
  }



  @ApiOperation({ summary: 'get all the servies paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.blogsService.findAllPaginated(Paginated);
  }


  // Configure multer for file upload and store in "pictures" folder
  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @UseInterceptors(
    FileInterceptor('image', {

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new HttpException('Only JPG, JPEG, and PNG files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')

  async create(
    @Body() CreateBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    // Use the file path as the image field in the DTO
    CreateBlogDto.image = file;

    return this.blogsService.create(CreateBlogDto);
  }





  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a service by ID' })
  async findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  async remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }


  // Other endpoints...

  @Put(':id')
  @ApiOperation({ summary: 'Update a service by ID' })
  @UseInterceptors(
    FileInterceptor('image', {

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new HttpException('Only JPG, JPEG, and PNG files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')

  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateServiceDto.image = file; // Update with new image if provided
    }

    return this.blogsService.update(id, updateServiceDto);
  }
}
