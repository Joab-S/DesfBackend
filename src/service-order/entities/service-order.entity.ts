import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
  
  
@Entity()
export class ServiceOrder extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  os_reason: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  priority: string;
  
  @Column({ nullable: true, type: 'varchar', length: 64 })
  appointment_date: string;
  
  @Column({ nullable: true, type: 'varchar', length: 64 })
  sector: string;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  reported_problem: string;

  @Column({ nullable: false })
  status: boolean;

  @ManyToOne(() => User, user => user.service_order)
  @JoinColumn({ name: 'user_id' })
  user: User;
  author: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
protocolo: id
motivo de OS: { preventiva, corretiva, financeiro }
Prioridade: { baixa, normal, alta }
data agendamento:
setor: { suporte externo, suporte interno, financeiro, gerencia }
problema reportado: txt
status: { aberto, fechado }
autor: id do user
*/