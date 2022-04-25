import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {    
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'super-secret',
      });
    }

  async validate(payload: { id: string }) {
    const { id } = payload;
    const user = await this.repository.findOne({where: {id: id}});
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
  
}