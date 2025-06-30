import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HubSpotTokenService } from './hubspot-token.service';
import { CreateHubspotContactDto } from '../dto/create-contact.dto';
import { UpdateHubspotContactDto } from '../dto/update-contact.dto';
import { GetContactDto } from '../dto/get-contact.dto';

@Injectable()
export class HubSpotService {
  constructor(
    private httpService: HttpService,
    private tokenService: HubSpotTokenService,
  ) {}

  async getContacts(userId: string): Promise<GetContactDto[]> {
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

  async getContactById(userId: string, contactId: string) {
    const token = await this.tokenService.getValidAccessToken(userId);
    const { data } = await firstValueFrom(
      this.httpService.get(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return data;
  }
  
  async createContact(userId: string, body: CreateHubspotContactDto) {
    const token = await this.tokenService.getValidAccessToken(userId);
    const { data } = await firstValueFrom(
      this.httpService.post('https://api.hubapi.com/crm/v3/objects/contacts', {
        properties: body,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return data;
  }
  
  async updateContact(userId: string, contactId: string, body: UpdateHubspotContactDto) {
    const token = await this.tokenService.getValidAccessToken(userId);
    const { data } = await firstValueFrom(
      this.httpService.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        properties: body,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return data;
  }
  
  async deleteContact(userId: string, contactId: string) {
    const token = await this.tokenService.getValidAccessToken(userId);
    await firstValueFrom(
      this.httpService.delete(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return { message: 'Contacto eliminado correctamente' };
  }
  
}
