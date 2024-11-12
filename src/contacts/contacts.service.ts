import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/services/dto/create-service.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactInterface } from './interfaces/contactInterface';

@Injectable()
export class ContactsService {

  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }





  // Create new quote
  async create(CreateContactDto: CreateContactDto
  ): Promise<ContactInterface> {

    const newContact = await this.prismaService.contact
      .create({
        data: {
          ...CreateContactDto
        }
      })

    return newContact;
  }

  // Get service by ID
  async findOne(id: string): Promise<ContactInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const contact = await this.prismaService.contact.findUnique({ where: { id } });

    if (!contact) {
      throw new NotFoundException('Service not found');
    }

    return contact;
  }

  // Get all quotes with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; contact: ContactInterface[] }> {

    const { page, pageSize } = paginated;

    // Get total count of services
    const totalCount = await this.prismaService.contact.count();

    const contact = await this.prismaService.contact
      .findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

    return {
      totalCount,
      contact

    }

  }

  // Update quote by ID
  async update(id: string, UpdateContactDto
    : UpdateContactDto): Promise<ContactInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.contact
      .findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prismaService.contact
      .update({
        where: { id },
        data: {
          ...UpdateContactDto

        },
      });

    return updatedService;
  }



  // Delete service by ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.contact
      .findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    await this.prismaService.contact
      .delete({ where: { id } });
  }


  // New service method to get the 3 most recent contacts
  async getRecentContacts(): Promise<ContactInterface[]> {
    const recentContacts = await this.prismaService.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return recentContacts;
  }



}

