import { Controller, Post, Body, Req, Get, Query, Res } from '@nestjs/common';
import { HubSpotService } from './hubspot.service';
import { HubSpotConnectDto } from './dto/connect.dto';
import { User } from 'src/auth/user.decorator';
import { Response } from 'express';

@Controller('hubspot')
export class HubSpotController {
  constructor(private readonly hubspotService: HubSpotService) {}

  @Post('connect')
  async connect(
    @Body() dto: HubSpotConnectDto,
    @User('userId') userId: string,
  ) {
    return this.hubspotService.connectWithHubspot(dto.code, userId);
  }

  @Get('callback')
  async handleHubSpotCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (!error) {
      console.error('Error de autorización de HubSpot:', error);
      return res.redirect(
        `http://localhost:5173/error-huspot?message=${encodeURIComponent(error)}`,
      );
    }
    if (!code || !state) {
      const msg = 'Callback de HubSpot incompleto: faltan code o state.';
      console.error(msg);
      return res.redirect(
        `http://localhost:5173/error-huspot?message=${encodeURIComponent(msg)}`,
      );
    }
    // Aquí iría la lógica normal del callback
    await this.hubspotService.validateStateAndGetUserId(state);
  }
}
