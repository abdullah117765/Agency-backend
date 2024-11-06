import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],


  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule { }
