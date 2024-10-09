import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UtilsService,

  ],
})
export class UsersModule { }
