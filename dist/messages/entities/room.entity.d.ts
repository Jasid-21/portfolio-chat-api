import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
export declare class Room {
    Id: number;
    name: string;
    users: User[];
    messages: Message[];
}
