import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';
import { HubspotAuthToken } from '@prisma/client';

@Injectable()
export class HubSpotTokenService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async saveHubSpotTokens(userId: string, tokens: TokenDto): Promise<HubspotAuthToken> {
    return await this.prismaService.hubspotAuthToken.upsert({
      where: { userId },
      update: {...tokens },
      create: { userId, ...tokens },
    });
  }
}
