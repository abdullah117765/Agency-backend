import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


import { PaginationDto } from 'src/services/dto/create-service.dto';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }


  @ApiOperation({ summary: 'get all the quotes paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.contactsService.findAllPaginated(Paginated);
  }


  // Configure multer for file upload and store in "pictures" folder
  @Post()
  @ApiOperation({ summary: 'Create a new service' })


  async create(
    @Body() CreateContactDto: CreateContactDto,
  ) {

    return this.contactsService.create(CreateContactDto);
  }


  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a service by ID' })
  async findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  async remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }


  // Other endpoints...

  @Put(':id')
  @ApiOperation({ summary: 'Update a service by ID' })

  async update(
    @Param('id') id: string,
    @Body() UpdateContactDto: UpdateContactDto,

  ) {

    return this.contactsService.update(id, UpdateContactDto);
  }
}
