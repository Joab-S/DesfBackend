import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { isAuthenticatedJWT } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('api/service-order')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  @Post('')
  @UseGuards(isAuthenticatedJWT)
  async create(@GetUser() user: User, @Body(ValidationPipe) createServiceOrderDto: CreateServiceOrderDto) {
    const service_order = await this.serviceOrderService.create(createServiceOrderDto, user);
    return {
      protocol: service_order.id,
      message: 'Verifique sua caixa de mensagens para mais informações!'
    };
  }

  @Get()
  @UseGuards(isAuthenticatedJWT)
  findAll(@GetUser() user: User) {
    return this.serviceOrderService.findAll(user);
  }

  @Get(':id')
  @UseGuards(isAuthenticatedJWT)
  findOne(@Param('id') id: string) {
    return this.serviceOrderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(isAuthenticatedJWT)
  update(@Param('id') id: string, @Body() updateServiceOrderDto: UpdateServiceOrderDto) {
    return this.serviceOrderService.update(id, updateServiceOrderDto);
  }

  @Delete(':id')
  @UseGuards(isAuthenticatedJWT)
  remove(@Param('id') id: string, @GetUser() user: User,) {
    this.serviceOrderService.remove(id, user);
    return {
      message: {id: id, message: 'Ordem de Serviço encerrada com sucesso!'}
    };
  }
}
