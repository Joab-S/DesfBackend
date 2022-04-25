import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { enumStatus } from './entities/roles.enum';
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

  findAll(user: User): Promise<ServiceOrder[]> {
    const service_orders = this.repository.find({where: {user: {id: user.id} }});
    return service_orders;
  }

  findOne(id: string) {
    const service_order = this.repository.findOne({where: {id: id}});
    return service_order;
  }

  update(id: string, updateServiceOrderDto: UpdateServiceOrderDto) {
    return `This action updates a #${id} serviceOrder`;
  }

  async remove(id: string, user: User) {
    const service_order = await this.repository.findOne({where: {id: id}});
    
    console.log(user)
    console.log(service_order)
    
    if (user != service_order.user) {
      throw new ForbiddenException (
        'Você não tem autorização para acessar este recurso.'
        )
      } 
    else{
      if (service_order.status == enumStatus.CLOSE) {
        throw new NotFoundException (
          'Esta Ordem de Serviço está fechada.'
        );
      }
      else {
        service_order.status = enumStatus.CLOSE;
        service_order.save();
      }
    }
  }
}
