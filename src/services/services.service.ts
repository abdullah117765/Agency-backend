import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateServiceDto, PaginationDto, statusDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceInterface } from './interfaces/service.interface';

@Injectable()
export class ServicesService {


  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }


  // Create new service
  async create(createServiceDto: CreateServiceDto): Promise<ServiceInterface> {
    const serviceExists = await this.prismaService.service.findFirst({
      where: { title: createServiceDto.title },
    });

    if (serviceExists) {
      throw new Error('Service with this title already exists');
    }

    console.log(createServiceDto.image);
    const newService = await this.prismaService.service.create({
      data: {
        title: createServiceDto.title,
        description: createServiceDto.description,
        status: createServiceDto.status,
        price: createServiceDto.price,
        image: createServiceDto.image.filename + createServiceDto.image.size,
      }
    })

    return newService;
  }

  // Get service by ID
  async findOne(id: string): Promise<ServiceInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const service = await this.prismaService.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  // Get all services with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<ServiceInterface[]> {

    const { page, pageSize } = paginated;

    const services = await this.prismaService.service.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return services;
  }

  // Update service by ID
  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.service.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prismaService.service.update({
      where: { id },
      data: {
        title: updateServiceDto.title,
        description: updateServiceDto.description,
        status: updateServiceDto.status,
        price: updateServiceDto.price,
        image: updateServiceDto.image.filename + updateServiceDto.image.size,
      },
    });

    return updatedService;
  }

  async updateStatus(id: string, statusdto: statusDto): Promise<ServiceInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.service.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }


    const updatedService = await this.prismaService.service.update({
      where: { id },
      data: { status: statusdto.status },
    });

    return updatedService;
  }

  // Delete service by ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.service.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    await this.prismaService.service.delete({ where: { id } });
  }
}
