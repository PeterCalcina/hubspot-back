import { IsNumber, IsString, IsOptional } from 'class-validator';

export class StandardResponse<T> {
  @IsNumber()
  status: number; // Status code HTTP (200, 400, 500, etc.)

  @IsString()
  message: string | string[];

  @IsOptional()
  data?: T; // Optional data field for successful responses
}
