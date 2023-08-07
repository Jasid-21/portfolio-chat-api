import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('increment')
  Id: number;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.rooms)
  users: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
