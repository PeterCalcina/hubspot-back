import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HubspotAuthToken } from '@prisma/client';

@Injectable()
export class HubSpotService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  
}
