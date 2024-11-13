import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateProjectDto, PaginationDto, statusDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';


@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) { }
  


  @Patch('status/:id')
  @ApiOperation({ summary: 'Update a status by ID' })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: statusDto,
  ) {
    return this.projectService.updateStatus(id, status);
  }



  @ApiOperation({ summary: 'get all the servies paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.projectService.findAllPaginated(Paginated);
  }


  // Configure multer for file upload and store in "pictures" folder
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
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
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    // Use the file path as the image field in the DTO
    createProjectDto.image = file;

    return this.projectService.create(createProjectDto);
  }





  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a project by ID' })
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  async remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }


  // Other endpoints...

  @Put(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
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
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateProjectDto.image = file; // Update with new image if provided
    }

    return this.projectService.update(id, updateProjectDto);
  }


}
