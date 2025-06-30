import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HubspotAuthToken } from '@prisma/client';
import { HubSpotTokenService } from './hubspot-token.service';

@Injectable()
export class HubSpotService {
  constructor(
    private httpService: HttpService,
    private tokenService: HubSpotTokenService,
  ) {}

  async getContacts(userId: string) {
    const token = await this.tokenService.getValidAccessToken(userId);

    const response = await firstValueFrom(
      this.httpService.get('https://api.hubapi.com/crm/v3/objects/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return response.data.results;
  }
  
}
