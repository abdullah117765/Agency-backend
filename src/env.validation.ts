import { IsEmail, IsNumber, IsString } from "class-validator";

export class EnvironmentVariables {
    @IsNumber()
    PORT: number;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    SMTP_HOST: string;

    @IsNumber()
    SMTP_PORT: number;

    @IsString()
    SMTP_USERNAME: string;

    @IsString()
    SMTP_PASSWORD: string;

    @IsEmail()
    MAIL_FROM: string;

    @IsString()
    BASE_URL: string;

    @IsString()
    AWS_PRIVATE_BUCKET_NAME: string;

    @IsString()
    AWS_ACCESS_KEY_ID: string;

    @IsString()
    AWS_SECRET_ACCESS_KEY: string;

    @IsString()
    AWS_REGION: string;


}
