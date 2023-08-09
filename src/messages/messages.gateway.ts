import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { WsJwtGuard } from '../services/wsJwtGuard.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly messagesService: MessagesService) {}
  handleDisconnect() {
    setTimeout(() => {
      const clients = this.messagesService.getCients(this.server);
      this.server.emit('set_online_clients', clients);
    }, 500);
  }

  //@UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    setTimeout(() => {
      const user = client['user'];
      if (!user) {
        client.disconnect();
        return;
      }
      const clients = this.messagesService.newConnection(this.server);
      this.server.emit('set_online_clients', clients);
    }, 1000);
  }

  @SubscribeMessage('new_room')
  async newRoom(client: Socket, data: { name: string; user_ids: number[] }) {
    const new_room = await this.messagesService.newRoom(data);
    if (!new_room) return;

    const clients = this.messagesService.getCients(this.server);
    const not_me = clients.find((c) => c.Id != client['user'].Id).socket;
    if (!not_me) return;

    const not_me_socket = this.server.sockets.sockets.get(not_me);
    const room_name = 'room_' + new_room.Id;
    client.join(room_name);
    not_me_socket.join(room_name);

    return new_room;
  }

  @SubscribeMessage('join_room')
  @UseGuards(WsJwtGuard)
  joinRoom(client: Socket, room_id: number) {
    const id = client['user'].Id;
    return this.messagesService.joinRooms([room_id], client, id);
  }

  @SubscribeMessage('get_rooms')
  @UseGuards(WsJwtGuard)
  async getAllRooms(client: Socket) {
    const rooms = await this.messagesService.getRooms(client['user'].Id);
    const room_ids = rooms.map((r) => r.Id);
    this.messagesService.joinRooms(room_ids, client, client['user'].Id);
    return rooms;
  }

  @SubscribeMessage('new_message')
  @UseGuards(WsJwtGuard)
  async newMessage(client: Socket, data: CreateMessageDto) {
    const message = await this.messagesService.newMessage(data);
    message.user = { ...message.user, password: null };

    const room_name = 'room_' + data.room_id;
    this.server.to(room_name).emit('new_message', message);
  }

  @SubscribeMessage('get_messages')
  @UseGuards(WsJwtGuard)
  getAllMessages(client: Socket, room_id: number) {
    return this.messagesService.getAllMessages(room_id);
  }
}
