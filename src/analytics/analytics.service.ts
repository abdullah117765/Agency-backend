import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AnalyticsService {

    constructor(
        private readonly prismaService: PrismaService,

        @Inject(forwardRef(() => UtilsService))
        private readonly utilsService: UtilsService
    ) { }



















}
