import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userName: string;

  @Column()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public role: Role;

  @Exclude()
  @CreateDateColumn()
  public createdDate: Date;

  @Exclude()
  @UpdateDateColumn()
  public updatedDate: Date;
}
