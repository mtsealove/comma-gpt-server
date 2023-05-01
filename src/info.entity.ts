import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Info extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;
}
