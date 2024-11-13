import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { ServicesModule } from './services/services.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProjectsModule } from './projects/projects.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    //, 
    PrismaModule, ServicesModule, UtilsModule, TestimonialsModule, UsersModule, QuotesModule, ContactsModule, BlogsModule, AnalyticsModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
