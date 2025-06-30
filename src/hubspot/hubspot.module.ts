import { Module } from '@nestjs/common';
import { HubSpotController } from './hubspot.controller';
import { HubSpotAuthService } from './services/hubspot-auth.service';
import { HttpModule } from '@nestjs/axios';
import { HubSpotTokenService } from './services/hubspot-token.service';
import { HubSpotService } from './services/hubspot.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [HubSpotController],
  providers: [HubSpotAuthService, HubSpotTokenService, HubSpotService],
})
export class HubSpotModule {}
