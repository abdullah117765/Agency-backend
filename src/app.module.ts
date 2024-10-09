import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    //, TestimonialsModule, UsersModule, QuotesModule, ContactsModule, BlogsModule
    PrismaModule, ServicesModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
