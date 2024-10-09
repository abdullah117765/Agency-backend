
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto, statusDto } from 'src/services/dto/create-service.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialInterface } from './interfaces/testimonialInterface';

@Injectable()
export class TestimonialsService {


  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }


  // Create new testimonials
  async create(CreateTestimonialDto: CreateTestimonialDto): Promise<TestimonialInterface> {


    console.log(CreateTestimonialDto.image);
    const newtestimonila = await this.prismaService.testimonials.create({
      data: {
        fullName: CreateTestimonialDto.fullName,
        description: CreateTestimonialDto.description,
        status: CreateTestimonialDto.status,
        image: CreateTestimonialDto.image.filename + CreateTestimonialDto.image.size,
      }
    })

    return newtestimonila;
  }

  // Get testimonials by ID
  async findOne(id: string): Promise<TestimonialInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const testimonials = await this.prismaService.testimonials.findUnique({ where: { id } });

    if (!testimonials) {
      throw new NotFoundException('testimonials not found');
    }

    return testimonials;
  }

  // Get all services with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<TestimonialInterface[]> {

    const { page, pageSize } = paginated;

    const testimonial = await this.prismaService.testimonials.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return testimonial;
  }

  // Update testimonials by ID
  async update(id: string, UpdateTestimonialDto: UpdateTestimonialDto): Promise<TestimonialInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.testimonials.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('testimonials not found');
    }

    const updatedService = await this.prismaService.testimonials.update({
      where: { id },
      data: {
        fullName: UpdateTestimonialDto.fullName,
        description: UpdateTestimonialDto.description,
        status: UpdateTestimonialDto.status,
        image: UpdateTestimonialDto.image.filename + UpdateTestimonialDto.image.size,
      },
    });

    return updatedService;
  }

  async updateStatus(id: string, statusdto: statusDto): Promise<TestimonialInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.testimonials.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('testimonials not found');
    }


    const updatedtest = await this.prismaService.testimonials.update({
      where: { id },
      data: { status: statusdto.status },
    });

    return updatedtest;
  }

  // Delete testimonials by ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.testimonials.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('tetimonial not found');
    }

    await this.prismaService.testimonials.delete({ where: { id } });
  }
}
