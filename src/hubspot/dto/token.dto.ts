import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;

  @IsDate()
  expiresAt: Date;

  @IsString()
  @IsNotEmpty()
  tokenType: string;
}
