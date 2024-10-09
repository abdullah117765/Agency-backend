import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],
  controllers: [QuotesController],
  providers: [
    QuotesService,
    PrismaService,
    UtilsService,
  ],
})
export class QuotesModule { }
