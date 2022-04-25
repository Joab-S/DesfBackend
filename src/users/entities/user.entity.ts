import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
import { Address } from './address.entity';
import { ServiceOrder } from 'src/service-order/entities/service-order.entity';
  
  
  @Entity()
  @Unique(['email'])
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false, type: 'varchar', length: 200 })
    email: string;
  
    @Column({ nullable: false, type: 'varchar', length: 200 })
    name: string;

    @Column({ nullable: true, type: 'varchar', length: 20 })
    phone: string;

    @Column({ nullable: false })
    salt: string;
  
    @Column({ nullable: false })
    password: string;
  
    @Column({ nullable: true, type: 'varchar', length: 64 })
    confirmationToken: string;
  
    @Column({ nullable: true, type: 'varchar', length: 64 })
    recoverToken: string;

    @OneToMany(() => ServiceOrder, (service_order: ServiceOrder) => service_order.user)
    service_order: ServiceOrder[];
    
    @OneToOne(() => Address, (address: Address) => address.user, {
      cascade: true,
      eager: true,
    })
    @JoinColumn()
    public address: Address;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    async getAddress(zipcode: string): Promise<Address>{
      const address: Address = null
      return address;
    }

    async checkPassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
  }