import { IsBoolean, isEnum, IsEnum, IsString, } from 'class-validator';
import { enumOsReason, enumPriority, enumSector, enumStatus } from '../entities/roles.enum';

export class CreateServiceOrderDto {    
    @IsString()
    @IsEnum(enumOsReason)
    os_reason: string;
    
    @IsString()
    @IsEnum(enumPriority)
    priority: string;
    
    @IsString()
    appointment_date: string;
    
    @IsString()
    @IsEnum(enumSector)
    sector: string;
    
    @IsString()
    reported_problem: string;
    
    @IsBoolean()
    @IsEnum(enumStatus)
    status: boolean;
}