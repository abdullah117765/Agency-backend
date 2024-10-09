// src/services/service.controller.ts
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
import { CreateServiceDto, PaginationDto, statusDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) { }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Update a status by ID' })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: statusDto,
  ) {
    return this.serviceService.updateStatus(id, status);
  }



  @ApiOperation({ summary: 'get all the servies paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.serviceService.findAllPaginated(Paginated);
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
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    // Use the file path as the image field in the DTO
    createServiceDto.image = file;

    return this.serviceService.create(createServiceDto);
  }





  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a service by ID' })
  async findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  async remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
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

    return this.serviceService.update(id, updateServiceDto);
  }
}
