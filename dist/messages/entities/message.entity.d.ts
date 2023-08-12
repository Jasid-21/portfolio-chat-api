import { User } from 'src/auth/entities/user.entity';
import { Room } from 'src/messages/entities/room.entity';
export declare class Message {
    Id: number;
    room: Room;
    user: User;
    message: string;
    send_date: Date;
}
