import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
interface CustomRequest extends Request {
  ip: string;
}


@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }
  

  @Get('/adminStats')
  async getAdminStats() {
    return this.analyticsService.getAdminStats();
  }

  @Post('track-visitor')
  async trackVisitor(@Req() req: CustomRequest) {
    // Handle both `string` and `string[]` for `x-forwarded-for`
    const ip = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;

    const userAgent = req.headers['user-agent'];

    await this.analyticsService.trackVisitor(ip, userAgent);
    return { message: 'Visitor tracked successfully' };
  }

  // Endpoint to get visitor data grouped by day for the current week
  @Get('visitors')
  async getVisitorsByDay(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.analyticsService.getVisitorsByDay(page, limit);
  }


  // Endpoint to get visitor data grouped by day for the current week
  @Get('blogs')
  async getBlogssByDay(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.analyticsService.getBlogsByDay(page, limit);
  }

}
