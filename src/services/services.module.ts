import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],

  controllers: [ServicesController],
  providers: [
    ServicesService,
    PrismaService,
    UtilsService,
  ],
})
export class ServicesModule { }
