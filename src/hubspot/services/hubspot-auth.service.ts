import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from '../dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HubspotAuthToken } from '@prisma/client';
import { getEnvironmentConfig } from 'src/common/config/environment.config';

@Injectable()
export class HubSpotAuthService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  async validateStateAndGetUserId(state: string): Promise<string> {
    const [userId] = state.split('_');
    if (!userId) {
      throw new Error('El state de HubSpot no contiene un userId válido.');
    }

    //TODO: Validate the userId or first connection

    return userId;
  }

  async exchangeCodeForTokens(code: string): Promise<TokenDto> {
    const config = getEnvironmentConfig().hubspot;

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUrl,
      code,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.hubapi.com/oauth/v1/token', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      if (response.status !== 200) {
        throw new BadRequestException(
          `Error al intercambiar el código por tokens: ${response.statusText}`,
        );
      }

      const { access_token, refresh_token, expires_in, token_type, scope } =
        response.data;

      const now = new Date();
      const expiresAt = new Date(now.getTime() + expires_in * 1000);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        expiresAt,
        tokenType: token_type,
      } as TokenDto;
    } catch (error) {
      console.error('[HubSpot Auth Error]', error);
      throw new BadRequestException(
        `Error al intercambiar el código por tokens: ${error.message}`,
      );
    }
  }
}
