import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [
    PrismaModule,

    forwardRef(() => UtilsModule),
  ],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    PrismaService,
    UtilsService,
  ],
})
export class ContactsModule { }
