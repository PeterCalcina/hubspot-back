import { IsString } from "class-validator";

export class GetContactDto {
  @IsString()
  id: string;

  
  properties: {
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    [key: string]: any;
  };
}