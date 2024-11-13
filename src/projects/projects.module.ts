import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
      PrismaService,
    UtilsService,
  ],
})
export class ProjectsModule {}
