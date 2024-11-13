
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


  // Create new testimonials
  async create(CreateTestimonialDto: CreateTestimonialDto): Promise<TestimonialInterface> {


    let imageUrl;
    const media = CreateTestimonialDto.image;


    // Upload image to S3

    if (media) {
      this.utilsService.validateImageType(media);
      imageUrl = await this.utilsService.s3uploadFile(media);
    }

    const newtestimonila = await this.prismaService.testimonials.create({
      data: {
        fullName: CreateTestimonialDto.fullName,
        description: CreateTestimonialDto.description,
        status: CreateTestimonialDto.status,
        image: imageUrl.url,
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
  async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; testimonials: TestimonialInterface[] }> {
    const { page, pageSize } = paginated;

    // Get total count of testimonials
    const totalCount = await this.prismaService.testimonials.count();

    // Get paginated testimonials
    const testimonials = await this.prismaService.testimonials.findMany({
      where: { status: "active" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      testimonials,
    };
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


    let imageUrl;
    const media = UpdateTestimonialDto.image;


    // delete previous one
    // Upload  new image to S3

    if (media) {
      this.utilsService.validateImageType(media);

      const Key = serviceExists.image.split('/').pop();
      await this.utilsService.s3deleteFile(Key);


      imageUrl = await this.utilsService.s3uploadFile(media);
    }




    const updatedService = await this.prismaService.testimonials.update({
      where: { id },
      data: {
        fullName: UpdateTestimonialDto.fullName,
        description: UpdateTestimonialDto.description,
        status: UpdateTestimonialDto.status,
        image: imageUrl.url,
      },
    });

    return updatedService;
  }


  // Delete testimonials by ID
  async remove(id: string): Promise<any> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.testimonials.findUnique({ where: { id } });



    const Key = serviceExists.image.split('/').pop();
    await this.utilsService.s3deleteFile(Key);



    if (!serviceExists) {
      throw new NotFoundException('tetimonial not found');
    }

    return await this.prismaService.testimonials.delete({ where: { id } });
  }
}
