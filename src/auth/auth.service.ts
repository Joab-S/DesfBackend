import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

    async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
        const { email, password } = credentialsDto;
        const user = await this.repository.findOne({where: { email }});
        if (user && (await user.checkPassword(password))) {
            if (user.confirmationToken || !user.password) throw new NotFoundException('Email não validado!');
            return user;
        } else {
            return null;
        }
    }

    async signIn(credentialsDto: CredentialsDto) {
        const user = await this.checkCredentials(credentialsDto);
    
        if (user === null) {
          throw new UnauthorizedException('Credenciais inválidas');
        }

        const jwtPayload = {
            id: user.id,
        };
        const token = await this.jwtService.sign(jwtPayload);
      
        return { token };
    }

    async confirmEmail(confirmationToken: string): Promise<void> {
        const user = await this.repository.findOne({where: {confirmationToken: confirmationToken}});

        const result = await this.repository.update(
          { confirmationToken },
          { confirmationToken: null },
        );
        await this.sendRecoverPasswordEmail(user.email);
        
        if (result.affected === 0) throw new NotFoundException('Token inválido');
      }

    async sendRecoverPasswordEmail(email: string): Promise<void> {
        const user = await this.repository.findOne({where: { email: email }});
    
        if (!user)
          throw new NotFoundException('Não há usuário cadastrado com esse email.');
    
        user.recoverToken = randomBytes(32).toString('hex');
        await user.save();
    
        const BASE_URL = 'http://localhost:3000/auth/reset-password';

        const url = `${BASE_URL}/${user.recoverToken}`;
        const text = `Clique no link para defina sua nova senha: ${url}`;
  
        const mail = {
          to: user.email,
          from:    'joabdev11@gmail.com',
          subject: 'Redefinição de senha',
          text,
        };

        await this.mailerService.sendMail(mail);
      }
    
    async resetPassword( recoverToken: string, changePasswordDto: ChangePasswordDto, ): Promise<void> {
        const user = await this.repository.findOne( { where: {recoverToken: recoverToken }},);
    
        if (!user) throw new NotFoundException('Token inválido.');

        try {
            await this.changePassword(user.id.toString(), changePasswordDto);
        } catch (error) {
            throw error;
        }
    }

    async changePassword( id: string, changePasswordDto: ChangePasswordDto,): Promise<void> {
        const { password, passwordConfirmation } = changePasswordDto;

        if (password != passwordConfirmation)
            throw new UnprocessableEntityException('As senhas não conferem');

        const user = await this.repository.findOne({where: {id: id} });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.recoverToken = null;
        await user.save();
    }
}
