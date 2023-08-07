import { User } from 'src/auth/entities/user.entity';
import { Room } from 'src/messages/entities/room.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('increment')
  Id: number;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column()
  message: string;

  @Column()
  send_date: Date;
}
