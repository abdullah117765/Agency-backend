import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateProjectDto, PaginationDto, statusDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectInterface } from './interfaces/project.interface';

@Injectable()
export class ProjectsService {



    constructor(
        private readonly prismaService: PrismaService,

        @Inject(forwardRef(() => UtilsService))
        private readonly utilsProject: UtilsService
    ) { }


    // Create new project
    async create(createProjectDto: CreateProjectDto): Promise<ProjectInterface> {
        const projectExists = await this.prismaService.projects.findFirst({
            where: { title: createProjectDto.title },
        });

        if (projectExists) {
            throw new Error('Project with this title already exists');
        }

        let imageUrl;
        const media = createProjectDto.image;


        // Upload image to S3

        if (media) {
            this.utilsProject.validateImageType(media);
            imageUrl = await this.utilsProject.s3uploadFile(media);
        }


        console.log(createProjectDto.image);
        const newProject = await this.prismaService.projects.create({
            data: {
                title: createProjectDto.title,
                description: createProjectDto.description,
                status: createProjectDto.status,
              
                image: imageUrl.url,
            }
        })

        return newProject;
    }

    // Get project by ID
    async findOne(id: string): Promise<ProjectInterface> {
        if (!id || id == '' || id == null) {
            throw new BadRequestException('ID is required');
        }


        const project = await this.prismaService.projects.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    // Get all projects with pagination and optional status filter
    async findAllPaginated(paginated: PaginationDto): Promise<{ totalCount: number; projects: ProjectInterface[] }> {

        const { page, pageSize } = paginated;


        // Get total count of projects
        const totalCount = await this.prismaService.projects.count();


        const projects = await this.prismaService.projects.findMany({
            where: {status:"active"},
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            totalCount,
            projects

        }
    }

    // Update project by ID
    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectInterface> {

        if (!id || id == '' || id == null) {
            throw new BadRequestException('ID is required');
        }

        const projectExists = await this.prismaService.projects.findUnique({ where: { id } });

        if (!projectExists) {
            throw new NotFoundException('Project not found');
        }


        let imageUrl;
        const media = updateProjectDto.image;


        // delete previous one
        // Upload  new image to S3

        if (media) {
            this.utilsProject.validateImageType(media);

            const Key = projectExists.image.split('/').pop();
            await this.utilsProject.s3deleteFile(Key);


            imageUrl = await this.utilsProject.s3uploadFile(media);
        }



        const updatedProject = await this.prismaService.projects.update({
            where: { id },
            data: {
                title: updateProjectDto.title,
                description: updateProjectDto.description,
                status: updateProjectDto.status,
                image: imageUrl.url,
            },
        });

        return updatedProject;
    }

    async updateStatus(id: string, statusdto: statusDto): Promise<ProjectInterface> {

        if (!id || id == '' || id == null) {
            throw new BadRequestException('ID is required');
        }

        const projectExists = await this.prismaService.projects.findUnique({ where: { id } });

        if (!projectExists) {
            throw new NotFoundException('Project not found');
        }


        const updatedProject = await this.prismaService.projects.update({
            where: { id },
            data: { status: statusdto.status },
        });

        return updatedProject;
    }

    // Delete project by ID
    async remove(id: string): Promise<void> {

        if (!id || id == '' || id == null) {
            throw new BadRequestException('ID is required');
        }
        const projectExists = await this.prismaService.projects.findUnique({ where: { id } });

        const Key = projectExists.image.split('/').pop();
        await this.utilsProject.s3deleteFile(Key);


        if (!projectExists) {
            throw new NotFoundException('Project not found');
        }

        await this.prismaService.projects.delete({ where: { id } });
    }









}
