import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AnalyticsService {

    constructor(
        private readonly prismaService: PrismaService,

        @Inject(forwardRef(() => UtilsService))
        private readonly utilsService: UtilsService
    ) { }

    async getAdminStats(): Promise<any> {

        const totalBlogs = await this.prismaService.blogs.count({
            where: { status: "active" }
        });

        const totalServices = await this.prismaService.service.count({
            where: { status: "active" }
        });

        const totalContacts = await this.prismaService.contact.count();

        const totalTestimonials = await this.prismaService.testimonials.count({
            where: { status: "active" }
        });

        return {
            totalBlogs,
            totalServices,
            totalContacts,
            totalTestimonials
        };
    }


    async trackVisitor(ip: string, userAgent: string) {
        // Check if the visitor already exists by IP
        const existingVisitor = await this.prismaService.visitor.findUnique({
            where: { ip },
        });

        // If no visitor is found, create a new record
        if (!existingVisitor) {
            await this.prismaService.visitor.create({
                data: {
                    ip,
                    userAgent,
                },
            });
        }
    }


    // Get visitors for the current week with pagination, grouped by day
    async getVisitorsByDay(page: number, limit: number): Promise<any> {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of this week
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // End of this week (Saturday)

        const visitors = await this.prismaService.visitor.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek, // Only get visitors from the current week
                    lte: endOfWeek,   // Until the end of the week
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalVisitorsByDay = await this.prismaService.visitor.groupBy({
            by: ['createdAt'],
            _count: {
                createdAt: true,
            },
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            },
        });

        // Group total visitors by each day of the week
        const dailyVisitorCounts = Array(7).fill(0); // Initialize an array for 7 days of the week

        totalVisitorsByDay.forEach((visitor) => {
            const dayOfWeek = new Date(visitor.createdAt).getDay(); // Get the day of the week (0-6)
            dailyVisitorCounts[dayOfWeek] = visitor._count.createdAt;
        });

        return {
            dailyVisitorCounts,
        };
    }


    // Get visitors for the current week with pagination, grouped by day
    async getBlogsByDay(page: number, limit: number): Promise<any> {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of this week
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // End of this week (Saturday)

        const visitors = await this.prismaService.blogs.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek, // Only get visitors from the current week
                    lte: endOfWeek,   // Until the end of the week
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalBlogsByDay = await this.prismaService.blogs.groupBy({
            by: ['createdAt'],
            _count: {
                createdAt: true,
            },
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            },
        });

        // Group total visitors by each day of the week
        const dailyVisitorCounts = Array(7).fill(0); // Initialize an array for 7 days of the week

        totalBlogsByDay.forEach((blog) => {
            const dayOfWeek = new Date(blog.createdAt).getDay(); // Get the day of the week (0-6)
            dailyVisitorCounts[dayOfWeek] = blog._count.createdAt;
        });

        return {
            dailyVisitorCounts,
        };
    }

}
