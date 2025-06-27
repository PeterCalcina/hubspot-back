import { Module } from '@nestjs/common';
import { HubSpotModule } from './hubspot/hubspot.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HubSpotModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
