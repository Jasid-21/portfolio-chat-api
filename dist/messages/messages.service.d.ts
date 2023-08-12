import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Room } from './entities/room.entity';
import { Socket, Server } from 'socket.io';
export declare class MessagesService {
    private readonly msgRepo;
    private readonly userRepo;
    private readonly roomRepo;
    constructor(msgRepo: Repository<Message>, userRepo: Repository<User>, roomRepo: Repository<Room>);
    newConnection(server: Server): any[];
    getRooms(user_id: number): Promise<Room[]>;
    newRoom(data: {
        name: string;
        user_ids: number[];
    }): Promise<Room>;
    joinRooms(room_ids: number[], user_socket: Socket, user_id: number): Promise<boolean>;
    leaveRoom(user_socket: Socket, room_id: number, user_id: number): Promise<boolean>;
    newMessage(createMsgDto: CreateMessageDto): Promise<Message>;
    getAllMessages(room_id: number): Promise<Message[]>;
    getCients(server: Server): any[];
}
