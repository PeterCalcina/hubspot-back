import { IsOptional, IsString } from "class-validator";

export class CreateHubspotContactDto {
  @IsString()
  email: string;
  
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