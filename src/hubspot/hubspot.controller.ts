import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { HubSpotAuthService } from './services/hubspot-auth.service';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { HubSpotTokenService } from './services/hubspot-token.service';
import { User } from 'src/auth/user.decorator';
import { HubSpotService } from './services/hubspot.service';
import { successResponse } from 'src/common/responses/success-response';
import { CreateHubspotContactDto } from './dto/create-contact.dto';
import { UpdateHubspotContactDto } from './dto/update-contact.dto';

@Controller('hubspot')
export class HubSpotController {
  constructor(
    private readonly hubspotAuth: HubSpotAuthService,
    private readonly hubSpotToken: HubSpotTokenService,
    private readonly hubSpot: HubSpotService,
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

  @Get('contacts')
  async getContacts(@User('id') userId: string) {
    const contacts = await this.hubSpot.getContacts(userId);
    return successResponse(contacts, 'Contactos cargados correctamente');
  }

  @Post('contacts')
  async create(
    @Body() dto: CreateHubspotContactDto,
    @User('id') userId: string,
  ) {
    const contact = await this.hubSpot.createContact(userId, dto);
    return successResponse(contact, 'Contacto creado correctamente');
  }

  @Get('contacts/:id')
  async getById(@Param('id') id: string, @User('id') userId: string) {
    const contact = await this.hubSpot.getContactById(userId, id);
    return successResponse(contact, 'Contacto obtenido correctamente');
  }

  @Patch('contacts/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHubspotContactDto,
    @User('id') userId: string,
  ) {
    const contact = await this.hubSpot.updateContact(userId, id, dto);
    return successResponse(contact, 'Contacto actualizado correctamente');
  }

  @Delete('contacts/:id')
  async remove(@Param('id') id: string, @User('id') userId: string) {
    const contact = await this.hubSpot.deleteContact(userId, id);
    return successResponse(contact, 'Contacto eliminado correctamente');
  }
}
