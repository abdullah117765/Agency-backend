import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./env.validation";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger("MainApplication");

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  const globalPrefix = "api";
  const config = new DocumentBuilder()
    .setTitle("Refferal Allay")
    .setDescription("Refferal Allay API description")
    .addServer("/api")
    .setVersion("1.0")
    .addTag("Refferal Allay")
    .addBearerAuth()
    .addTag("auth", "Authentication Module")
    .addTag("users", "Users Module")
    .addTag("user-management", "User-management Module")
    .addTag("contacts", "Contact Module")
    .addTag("referrals", "Referrals Module")
    .addTag("tasks", "Task Module")
    .addTag("chats", "Chat Module")
    .addTag("notifications", "Notification Module")
    .addTag("guidelines", "Guideline Module")
    .addTag("suggestion", "suggestion Module")
    .addTag("activity-log", "Activity-log Module")
    .addTag("engagement-team", "Engagement-team Module")
    .addTag("statistics", "Statistics Module")
    .addTag("quicksite", "Quicksite Module")
    .addTag("app", "App Module")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document);
  app.useStaticAssets(join(__dirname, "../..", "public/images"), {
    prefix: "/api",
  });

  // app.useStaticAssets(join(__dirname, "../..", "public/template"), {
  //   prefix: "/template",
  // });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get("PORT");
  app.enableCors();

  await app.listen(port, () => {
    logger.log(`Listening API at http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
