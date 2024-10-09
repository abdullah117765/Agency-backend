import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/services/dto/create-service.dto';

import { UtilsService } from 'src/utils/utils.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteInterface } from './interfaces/quoteInterface';

@Injectable()
export class QuotesService {



  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }


  // Create new quote
  async create(CreateQuoteDto: CreateQuoteDto
  ): Promise<QuoteInterface> {

    const newService = await this.prismaService.quote
      .create({
        data: {
          ...CreateQuoteDto
        }
      })

    return newService;
  }

  // Get service by ID
  async findOne(id: string): Promise<QuoteInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const service = await this.prismaService.quote.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  // Get all quotes with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<QuoteInterface[]> {

    const { page, pageSize } = paginated;

    const quotes = await this.prismaService.quote
      .findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

    return quotes;
  }

  // Update quote by ID
  async update(id: string, UpdateQuoteDto
    : UpdateQuoteDto): Promise<QuoteInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.quote
      .findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prismaService.quote
      .update({
        where: { id },
        data: {
          ...UpdateQuoteDto

        },
      });

    return updatedService;
  }



  // Delete service by ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.quote
      .findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    await this.prismaService.quote
      .delete({ where: { id } });
  }
}

