import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import { v4 as uuid } from 'uuid';

@Injectable()
export class UtilsService {


    private readonly s3: S3;

    constructor(

        private readonly configService: ConfigService,
    ) {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }




    async s3uploadFile(file: Express.Multer.File): Promise<any> {
        try {
            const key = `${uuid()}-${file.originalname}`;
            const uploadResult = await this.s3.upload({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Body: file.buffer,
                Key: key,

            }).promise();

            return { url: uploadResult.Location, mimeType: file.mimetype, size: file.size, key: uploadResult.Key };
        } catch (error) {
            console.error(error);
            throw new UnprocessableEntityException(`Failed to upload file: ${error.message}`);
        }
    }





    async s3deleteFile(key: string): Promise<any> {
        try {
            const deleteResult = await this.s3.deleteObject({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: key,
            }).promise();

            return { success: true, result: deleteResult };
        } catch (error) {
            console.error(error);
            throw new UnprocessableEntityException(`Failed to delete file: ${error.message}`);
        }
    }




    async validateImageType(image: Express.Multer.File) {

        const imagefileType = image.mimetype.split('/')[0];
        console.log({ imagefileType });

        if (imagefileType !== 'image')
            throw new BadRequestException('Invalid file type. Only image files are allowed');
        if (imagefileType === 'image' && !image.originalname.match(/\.(jpg|jpeg|png|gif)$/))
            throw new BadRequestException('Invalid image type. Only jpg, jpeg, png, and gif images are allowed');

        return true;
    }

















}
