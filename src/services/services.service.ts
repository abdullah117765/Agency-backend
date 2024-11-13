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

    let imageUrl;
    const media = createServiceDto.image;


    // Upload image to S3

    if (media) {
      this.utilsService.validateImageType(media);
      imageUrl = await this.utilsService.s3uploadFile(media);
    }


    console.log(createServiceDto.image);
    const newService = await this.prismaService.service.create({
      data: {
        title: createServiceDto.title,
        description: createServiceDto.description,
        status: createServiceDto.status,
        price: createServiceDto.price,
        image: imageUrl.url,
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
  async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; services: ServiceInterface[] }> {

    const { page, pageSize,status } = paginated;


    // Get total count of services
    const totalCount = await this.prismaService.service.count();


    const services = await this.prismaService.service.findMany({
      where: { status: status },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      services

    }
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


    let imageUrl;
    const media = updateServiceDto.image;


    // delete previous one
    // Upload  new image to S3

    if (media) {
      this.utilsService.validateImageType(media);

      const Key = serviceExists.image.split('/').pop();
      await this.utilsService.s3deleteFile(Key);


      imageUrl = await this.utilsService.s3uploadFile(media);
    }



    const updatedService = await this.prismaService.service.update({
      where: { id },
      data: {
        title: updateServiceDto.title,
        description: updateServiceDto.description,
        status: updateServiceDto.status,
        price: updateServiceDto.price,
        image: imageUrl.url,
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

    const Key = serviceExists.image.split('/').pop();
    await this.utilsService.s3deleteFile(Key);


    if (!serviceExists) {
      throw new NotFoundException('Service not found');
    }

    await this.prismaService.service.delete({ where: { id } });
  }
}
