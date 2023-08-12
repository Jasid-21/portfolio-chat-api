import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    server: Server;
    constructor(messagesService: MessagesService);
    handleDisconnect(): void;
    handleConnection(client: Socket): void;
    newRoom(client: Socket, data: {
        name: string;
        user_ids: number[];
    }): Promise<import("./entities/room.entity").Room>;
    joinRoom(client: Socket, room_id: number): Promise<boolean>;
    getAllRooms(client: Socket): Promise<import("./entities/room.entity").Room[]>;
    newMessage(client: Socket, data: CreateMessageDto): Promise<void>;
    getAllMessages(client: Socket, room_id: number): Promise<import("./entities/message.entity").Message[]>;
}
