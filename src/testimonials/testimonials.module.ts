import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],

  controllers: [TestimonialsController],
  providers: [
    TestimonialsService,
    PrismaService,
    UtilsService,

  ],
})
export class TestimonialsModule { }
