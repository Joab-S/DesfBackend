import { HttpException, HttpStatus, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Address } from './entities/address.entity';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>, readonly httpService: HttpService,) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, phone, zipcode } = createUserDto;

    const user = this.repository.create();
    user.email = email;
    user.name = name;
    user.phone = phone;

    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
  
    try {
      await this.repository.save(user);
      
      const { cep, logradouro, complemento, bairro,
        localidade, uf, ibge, gia, ddd, siafi
      } = await this.getAddressByZipcode(zipcode);

      const address = Address.create()
      address.zipcode = cep;
      address.public_place = logradouro;
      address.add_on = complemento;
      address.neighborhood = bairro;
      address.locality = localidade;
      address.uf = uf;
      address.ibge = ibge;
      address.gia = gia;
      address.ddd = ddd;
      address.siafi = siafi;
      address.save();
      user.address = address;
      
      await this.repository.save(user);
      return user;

    } catch (error) {
      if (error.code === '23505') {
        throw new NotFoundException ('Endereço de email já está em uso',);
      } else {
        throw new HttpException('Erro ao salvar o usuário no banco de dados', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<User> {
    const user = this.repository.findOne({where: {id: id}});
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.repository.save(user);
  }
 
  async remove(id: string) {
    const result = await this.repository.delete( { id: id });

    if (result.affected == 0) {
      throw new NotFoundException (
        'Um usuário com este ID não foi encontrado.'
      );
    }
  }

  async getAddressByZipcode (zipcode: string): Promise<any>{
    return lastValueFrom(this.httpService.get<any>(`https://viacep.com.br/ws/${zipcode}/json`).pipe(
      map(res => {return res.data})));
  }

}