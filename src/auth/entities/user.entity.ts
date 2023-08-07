import { Message } from 'src/messages/entities/message.entity';
import { Room } from 'src/messages/entities/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  Id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];
}
