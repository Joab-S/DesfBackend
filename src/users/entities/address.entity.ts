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
  } from 'typeorm';
import { User } from './user.entity';
  

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false, type: 'varchar', length: 20 })
    zipcode: string;
    
    @Column({ nullable: true, type: 'varchar', length: 64 })
    public_place: string;
    
    @Column({ nullable: true, type: 'varchar', length: 64 })
    add_on: string;
    
    @Column({ nullable: true, type: 'varchar', length: 64 })
    neighborhood: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    locality: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    uf: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    ibge: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    gia: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    ddd: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    siafi: string;

    @OneToOne(() => User, (user: User) => user.address, {})
    public user: User;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}