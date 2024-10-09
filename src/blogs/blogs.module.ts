import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PrismaService,
    UtilsService,
  ],
})
export class BlogsModule { }
