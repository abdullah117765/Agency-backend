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

    let imageUrl;
    const media = CreateUserDto.image;


    // Upload image to S3

    if (media) {
      this.utilsService.validateImageType(media);
      imageUrl = await this.utilsService.s3uploadFile(media);
    }




    console.log("aws image", imageUrl.url);
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
        image: imageUrl.url,
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
  async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; users: UserInterface[] }> {

    const { page, pageSize, status } = paginated;

    // Get total count of users
    const totalCount = await this.prismaService.user.count();

    const users = await this.prismaService.user.findMany({
      where: { status: status},
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      users,
    }
  }

  // Update userby ID
  async update(id: string, UpdateUserDto: UpdateUserDto): Promise<UserInterface> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }

    const userExists = await this.prismaService.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new NotFoundException('usernot found');
    }

    let imageUrl;
    const media = UpdateUserDto.image;


    // delete previous one
    // Upload  new image to S3

    if (media) {
      this.utilsService.validateImageType(media);

      const Key = userExists.image.split('/').pop();
      await this.utilsService.s3deleteFile(Key);


      imageUrl = await this.utilsService.s3uploadFile(media);
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
        image: imageUrl.url,
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
  async remove(id: string): Promise<any> {

    if (!id || id == '' || id == null) {
      throw new BadRequestException('ID is required');
    }
    const serviceExists = await this.prismaService.user.findUnique({ where: { id } });


    const Key = serviceExists.image.split('/').pop();
    await this.utilsService.s3deleteFile(Key);



    if (!serviceExists) {
      throw new NotFoundException('user not found');
    }

    return await this.prismaService.user.delete({ where: { id } });

  }
}
