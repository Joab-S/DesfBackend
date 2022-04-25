import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const { email, name, phone, zipcode, password } = createUserDto;

      const user = this.repository.create();
      user.email = email;
      user.name = name;
      user.phone = phone;
      user.address = await user.getAddress(zipcode);
      user.confirmationToken = crypto.randomBytes(32).toString('hex');
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);

      try {
        this.repository.save(user);
        
        return user;

      } catch (error) {
        if (error.code.toString() === '23505') {
          throw new ConflictException('Endereço de email já está em uso');
        } else {
          throw new InternalServerErrorException(
            'Erro ao salvar o usuário no banco de dados',
          );
        }
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
}