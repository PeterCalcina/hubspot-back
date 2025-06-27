import { IsNotEmpty, IsString } from "class-validator";

export class HubSpotConnectDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
