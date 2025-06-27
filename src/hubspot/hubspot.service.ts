import { Injectable } from '@nestjs/common';

@Injectable()
export class HubSpotService {
  connectWithHubspot(code: string, userId: string) {
    return 'Hello World!';
  }

  validateStateAndGetUserId(state: string) {
    console.log("Todo salio bien");
  }

  exchangeCodeForTokens(userId: string, tokens: string[]) {

  }

  saveHubSpotTokens(userId: string, tokens: string[]) {
    // return res.redirect('http://localhost:3000/hubspot/connected');
  }
}
