import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto, statusDto } from 'src/services/dto/create-service.dto';

import { UtilsService } from 'src/utils/utils.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogInterface } from './interfaces/blogInterface';
@Injectable()
export class BlogsService {

  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }



  // Create new service
  async create(CreateBlogDto: CreateBlogDto): Promise<BlogInterface> {
    const serviceExists = await this.prismaService.blogs.findFirst({
      where: { title: CreateBlogDto.title },
    });

    if (serviceExists) {
      throw new Error('Service with this title already exists');
    }

    console.log(CreateBlogDto.image);
    const newService = await this.prismaService.blogs.create({
      data: {
        title: CreateBlogDto.title,
        description: CreateBlogDto.description,
        status: CreateBlogDto.status,
        author: CreateBlogDto.author,
        image: CreateBlogDto.image.mimetype,
      }
    })

    return newService;
  }

  // Get service by ID
  async findOne(id: string): Promise<BlogInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const blog = await this.prismaService.blogs.findUnique({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  // Get all blogs with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; blogs: BlogInterface[] }> {

    const { page, pageSize } = paginated;

    // Get total count of blogs
    const totalCount = await this.prismaService.blogs.count();

    const blogs = await this.prismaService.blogs.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      blogs,
    }
  }

  // Update blog by ID
  async update(id: string, UpdateBlogDto: UpdateBlogDto): Promise<BlogInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.blogs.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('blog not found');
    }

    const updatedService = await this.prismaService.blogs.update({
      where: { id },
      data: {
        title: UpdateBlogDto.title,
        description: UpdateBlogDto.description,
        status: UpdateBlogDto.status,
        author: UpdateBlogDto.author,
        image: UpdateBlogDto.image.mimetype,
      },
    });

    return updatedService;
  }

  async updateStatus(id: string, statusdto: statusDto): Promise<BlogInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.blogs.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('blog not found');
    }


    const updatedService = await this.prismaService.blogs.update({
      where: { id },
      data: { status: statusdto.status },
    });

    return updatedService;
  }

  // Delete blog by ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.blogs.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('blog not found');
    }

    await this.prismaService.blogs.delete({ where: { id } });
  }
}

