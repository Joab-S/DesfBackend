import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CredentialsDto {
    @IsNotEmpty({
        message: 'Informe um endereço de email',
    })
    @IsEmail( {},
    {
        message: 'Informe um endereço de email válido',
    })
    email: string;

    @IsString()
    password: string;
  }