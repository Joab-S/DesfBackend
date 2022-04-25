import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { ServiceOrder } from './entities/service-order.entity';

@Injectable()
export class ServiceOrderService {
  constructor(@InjectRepository(ServiceOrder) private readonly repository: Repository<ServiceOrder>) {}
  
  async create(
    createServiceOrderDto: CreateServiceOrderDto, user: User): Promise<ServiceOrder> {
    const { os_reason, priority, sector,
            appointment_date, reported_problem, status
    } = createServiceOrderDto;
    
    const serviceOrder = this.repository.create();
    serviceOrder.os_reason = os_reason;
    serviceOrder.priority = priority;
    serviceOrder.appointment_date = appointment_date;
    serviceOrder.sector = sector;
    serviceOrder.reported_problem = reported_problem;
    serviceOrder.status = status;
    serviceOrder.user = user;
    
    try {
      await serviceOrder.save();
      return serviceOrder;
      
    } catch (error) {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
    }
  }

  findAll() {
    return `This action returns all serviceOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceOrder`;
  }

  update(id: number, updateServiceOrderDto: UpdateServiceOrderDto) {
    return `This action updates a #${id} serviceOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceOrder`;
  }
}
