import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto, statusDto } from 'src/services/dto/create-service.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interfaces/userInterface';





@Injectable()
export class UsersService {


  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService
  ) { }


  // Create new user
  async create(CreateUserDto: CreateUserDto): Promise<UserInterface> {
    const serviceExists = await this.prismaService.user.findFirst({
      where: { email: CreateUserDto.email },
    });

    if (serviceExists) {
      throw new Error('user with this email already exists');
    }

    console.log(CreateUserDto.image);
    const newUser = await this.prismaService.user.create({
      data: {
        fullname: CreateUserDto.fullname,
        email: CreateUserDto.email,
        instagram: CreateUserDto.instagram || '',
        twitter: CreateUserDto.twitter || '',
        linkedin: CreateUserDto.linkedin || '',
        role: CreateUserDto.role,
        status: CreateUserDto.status,
        phoneNumber: CreateUserDto.phoneNumber,
        image: CreateUserDto.image.filename + CreateUserDto.image.size,
      }
    })

    return newUser;
  }

  // Get user by ID
  async findOne(id: string): Promise<UserInterface> {
    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }


    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('usernot found');
    }

    return user;
  }

  // Get all services with pagination and optional status filter
  async findAllPaginated(paginated: PaginationDto): Promise<UserInterface[]> {

    const { page, pageSize } = paginated;

    const services = await this.prismaService.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return services;
  }

  // Update userby ID
  async update(id: string, UpdateUserDto: UpdateUserDto): Promise<UserInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.user.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('usernot found');
    }

    const updatedService = await this.prismaService.user.update({
      where: { id },
      data: {
        fullname: UpdateUserDto.fullname,
        email: UpdateUserDto.email,
        instagram: UpdateUserDto.instagram,
        twitter: UpdateUserDto.twitter,
        linkedin: UpdateUserDto.linkedin,
        role: UpdateUserDto.role,
        status: UpdateUserDto.status,
        phoneNumber: UpdateUserDto.phoneNumber,
        image: UpdateUserDto.image.filename + UpdateUserDto.image.size,
      },
    });

    return updatedService;
  }

  async updateStatus(id: string, statusdto: statusDto): Promise<UserInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const serviceExists = await this.prismaService.user.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('usernot found');
    }


    const updatedService = await this.prismaService.user.update({
      where: { id },
      data: { status: statusdto.status },
    });

    return updatedService;
  }

  // Delete userby ID
  async remove(id: string): Promise<void> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.user.findUnique({ where: { id } });

    if (!serviceExists) {
      throw new NotFoundException('user not found');
    }

    await this.prismaService.user.delete({ where: { id } });
  }
}
