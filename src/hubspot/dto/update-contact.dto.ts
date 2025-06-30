import { IsOptional, IsString } from "class-validator";

export class UpdateHubspotContactDto {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  website?: string;
  
  [key: string]: any;
}