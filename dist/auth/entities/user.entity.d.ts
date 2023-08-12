import { Message } from 'src/messages/entities/message.entity';
import { Room } from 'src/messages/entities/room.entity';
export declare class User {
    Id: number;
    username: string;
    password: string;
    messages: Message[];
    rooms: Room[];
}
