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



  // New endpoint to get the 3 most recent contacts
  @Get('/recent')
  @ApiOperation({ summary: 'Get the 3 most recent contacts' })
  async getRecentContacts() {
    return this.contactsService.getRecentContacts();
  }


  @ApiOperation({ summary: 'Create a new service' })
  @Post()
  async create(
    @Body() createContactDto: CreateContactDto,
  ) {
    console.log('Received Contact DTO:', createContactDto);

    return this.contactsService.create(createContactDto);
  }




  @ApiOperation({ summary: 'get all the quotes paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.contactsService.findAllPaginated(Paginated);
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
