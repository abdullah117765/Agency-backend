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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



  @Patch('status/:id')
  @ApiOperation({ summary: 'Update a status by ID' })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: statusDto,
  ) {
    return this.usersService.updateStatus(id, status);
  }



  @ApiOperation({ summary: 'get all the servies paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.usersService.findAllPaginated(Paginated);
  }


  // Configure multer for file upload and store in "pictures" folder
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
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
    @Body() CreateUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    // Use the file path as the image field in the DTO
    CreateUserDto.image = file;

    return this.usersService.create(CreateUserDto);
  }





  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


  // Other endpoints...

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
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
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.image = file; // Update with new image if provided
    }

    return this.usersService.update(id, updateUserDto);
  }

}

