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
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesService } from './quotes.service';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) { }


  @ApiOperation({ summary: 'get all the quotes paginated' })
  @Get('/paginated')
  getPaginatedRatings(@Query() Paginated: PaginationDto) {
    return this.quotesService.findAllPaginated(Paginated);
  }


  // Configure multer for file upload and store in "pictures" folder
  @Post()
  @ApiOperation({ summary: 'Create a new service' })


  async create(
    @Body() CreateQuoteDto: CreateQuoteDto,
  ) {

    return this.quotesService.create(CreateQuoteDto);
  }


  @Get('findone/:id')
  @ApiOperation({ summary: 'Get a service by ID' })
  async findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  async remove(@Param('id') id: string) {
    return this.quotesService.remove(id);
  }


  // Other endpoints...

  @Put(':id')
  @ApiOperation({ summary: 'Update a service by ID' })

  async update(
    @Param('id') id: string,
    @Body() UpdateQuoteDto: UpdateQuoteDto,

  ) {

    return this.quotesService.update(id, UpdateQuoteDto);
  }
}
