import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],

  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    PrismaService,
    UtilsService,

  ],
})
export class AnalyticsModule { }
