import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('HIS_TREATMENT')
export class Treatment {
    @PrimaryColumn()
    ID: string;

    @Column()
    Name: string;

    @Column({ name: 'IN_TIME' })
    inTime: Date;
} 