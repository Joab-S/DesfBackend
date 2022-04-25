import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    
    @IsNotEmpty({
        message: 'Informe um endereço de email',
    })
    @IsEmail( {},
    {
        message: 'Informe um endereço de email válido',
    })
    email: string;
    
    @IsString()
    phone: string;

    @IsInt()
    zipcode: string;
  }