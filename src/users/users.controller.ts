import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { isAuthenticatedJWT } from 'src/auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
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

  @Patch(':id')
  @UseGuards(isAuthenticatedJWT)
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto, @GetUser() user: User,) {
    if (user.id.toString() != id) {
      throw new ForbiddenException (
        'Você não tem autorização para acessar este recurso.'
      )
    } else {
      return this.usersService.update(id, updateUserDto);
    }
  }

  @Delete(':id')
  @UseGuards(isAuthenticatedJWT)
  remove(@Param('id') id: string, @GetUser() user: User,) {
    if (user.id.toString() != id) {
      throw new ForbiddenException (
        'Você não tem autorização para acessar este recurso.'
      )
    }
      else {
      this.usersService.remove(id);
      return {
        message: {id: id, message: 'Usuário deletado com sucesso!'}
      };
    }
  }
}