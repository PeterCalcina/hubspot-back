import { Controller, Get, Query, Res } from '@nestjs/common';
import { HubSpotAuthService } from './services/hubspot-auth.service';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { HubSpotTokenService } from './services/hubspot-token.service';

@Controller('hubspot')
export class HubSpotController {
  constructor(private readonly hubspotAuth: HubSpotAuthService,
    private readonly hubSpotToken: HubSpotTokenService
  ) {}

  @Public()
  @Get('callback')
  async handleHubSpotCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error) {
      console.error('Error de autorización de HubSpot:', error);
      return res.redirect(
        `http://localhost:5173/error-hubspot?message=${encodeURIComponent(error)}`,
      );
    }
    if (!code || !state) {
      const msg = 'Callback de HubSpot incompleto: faltan code o state.';
      console.error(msg);
      return res.redirect(
        `http://localhost:5173/error-huspot?message=${encodeURIComponent(msg)}`,
      );
    }
    
    try {
      const userId = await this.hubspotAuth.validateStateAndGetUserId(state);
      const tokens = await this.hubspotAuth.exchangeCodeForTokens(code);
      await this.hubSpotToken.saveHubSpotTokens(userId, tokens);
  
      return res.redirect(`http://localhost:5173/success-hubspot`);
    } catch (err) {
      console.error('[HubSpot Callback Error]', err.message);
      return res.redirect(
        `http://localhost:5173/error-hubspot?message=${encodeURIComponent(
          'HubSpot connection failed',
        )}`,
      );
    }
  }
}
