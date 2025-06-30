import { Module } from '@nestjs/common';
import { HubSpotModule } from './hubspot/hubspot.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { getEnvironmentConfig } from './common/config/environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentConfig],
    }),
    HubSpotModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
