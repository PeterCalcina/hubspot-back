import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';

@Injectable()
export class HubSpotTokenService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async saveHubSpotTokens(userId: string, tokens: TokenDto): Promise<boolean> {
    try {
      const result = await this.prismaService.hubspotAuthToken.upsert({
        where: { userId },
        update: {...tokens },
        create: { userId, ...tokens },
      });

      if(!result) {
        throw new InternalServerErrorException('No se pudo guardar el token de HubSpot.');
      }

      return true;
    } catch {
      throw new InternalServerErrorException('Error al guardar el token de HubSpot.');
    }
  }
}
