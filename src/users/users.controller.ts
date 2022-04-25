import { Controller, Get, Post, Body, Patch, Param,
  Delete, ValidationPipe, UseGuards, ForbiddenException,
  ConflictException, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { isAuthenticatedJWT } from 'src/auth/jwt-auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
    ) {}

  @Post('signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    
      const user = await this.usersService.create(createUserDto);
      
      const BASE_URL = 'http://localhost:3000/auth';

      const url = `${BASE_URL}/${user.confirmationToken}`;
      const text = `Bem vindo a aplicação. Confirme seu email clicando aqui: ${url}`;

      const mail = {
        to: user.email,
        from: 'joabdev11@gmail.com',
        subject: 'Email de confirmação',
        text,
      };
      await this.mailerService.sendMail(mail);

      return {
        user: user.email,
        message: 'Verifique sua caixa de mensagens para validar seu email!'
      };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  //@UseGuards(AuthGuard('jwt')) //proteje a rota para somente usuario autenticado
  @UseGuards(isAuthenticatedJWT)
  getMe(@GetUser() user: User) {
    return {
      "id": user.id,
      "name": user.name,
      "email": user.email,
      "address": user.address,
      "phone": user.phone
    };
  }

  @Get(':id')
  @UseGuards(isAuthenticatedJWT)
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto, @GetUser() user: User,) {
    if (user.id.toString() != id) {
      throw new HttpException('Você não tem autorização para acessar este recurso.', HttpStatus.BAD_REQUEST);
    } else {
      return this.usersService.update(id, updateUserDto);
    }
  }

  @Delete(':id')
  @UseGuards(isAuthenticatedJWT)
  remove(@Param('id') id: string, @GetUser() user: User,) {
    if (user.id.toString() != id) {
      throw new HttpException('Você não tem autorização para acessar este recurso.', HttpStatus.BAD_REQUEST);
    }
      else {
      this.usersService.remove(id);
      return {
        message: {id: id, message: 'Usuário deletado com sucesso!'}
      };
    }
  }
}