import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';
import { getEnvironmentConfig } from 'src/common/config/environment.config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HubSpotTokenService {
  constructor(
    private prismaService: PrismaService,
    private http: HttpService,
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

  async getValidAccessToken(userId: string): Promise<string> {
    const token = await this.prismaService.hubspotAuthToken.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new InternalServerErrorException('No se encontró el token de HubSpot para el usuario.');
    }

    if (new Date() > token.expiresAt) {
      const refreshed = await this.refreshToken(token.refreshToken);
      await this.saveHubSpotTokens(userId, refreshed);
      return refreshed.accessToken;
    }

    return token.accessToken;
  }

  async refreshToken(refreshToken: string): Promise<TokenDto> {
    const config = getEnvironmentConfig().hubspot;

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await firstValueFrom(
      this.http.post('https://api.hubapi.com/oauth/v1/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    const { access_token, refresh_token: new_refresh_token, expires_in, token_type } =
      response.data;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken: new_refresh_token ?? refreshToken,
      expiresIn: expires_in,
      tokenType: token_type,
      expiresAt,
    };
  }
}
