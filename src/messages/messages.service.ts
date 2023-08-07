import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import { Room } from 'src/messages/entities/room.entity';
import { Socket, Server } from 'socket.io';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}
  newConnection(server: Server) {
    return this.getCients(server);
  }

  async getRooms(user_id: number) {
    return await this.roomRepo
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.users', 'ur')
      .leftJoin('r.messages', 'm')
      .select(['m.Id', 'm.message', 'm.user'])
      .leftJoin('m.user', 'u')
      .select(['u.Id', 'u.username'])
      .where('ur.Id = :user_id', { user_id })
      .select(['r.Id', 'r.name', 'm', 'u.Id', 'u.username'])
      .orderBy('m.send_date', 'DESC')
      .getMany();
  }

  async newRoom(data: { name: string; user_ids: number[] }) {
    const { name, user_ids } = data;
    const raw_room = await this.roomRepo.create();
    raw_room.name = name;

    const users: User[] = [];
    for (const id of user_ids) {
      const user = await this.userRepo.findOneBy({ Id: id });
      if (user) {
        users.push(user);
      }
    }
    raw_room.users = users;
    raw_room.messages = [];

    return await this.roomRepo.save(raw_room);
  }

  async joinRooms(room_ids: number[], user_socket: Socket, user_id: number) {
    for (const id of room_ids) {
      const room = await this.roomRepo.findOne({
        where: { Id: id },
        relations: ['users'],
      });
      if (!room) return;

      const user = await this.userRepo.findOneBy({ Id: user_id });
      if (!user) return;

      room.users.push(user);
      const saved = await this.roomRepo.save(room);
      if (!saved) return;

      const socket_room_name = 'room_' + id;
      user_socket.join(socket_room_name);
    }

    return true;
  }

  async leaveRoom(user_socket: Socket, room_id: number, user_id: number) {
    const room = await this.roomRepo.findOneBy({ Id: room_id });
    if (!room) return;

    const index = room.users.findIndex((u) => u.Id == user_id);
    if (index < 0) return;

    room.users.splice(index);
    const saved = await this.roomRepo.save(room);
    if (!saved) return;

    const room_name = 'room_' + room_id;
    user_socket.leave(room_name);

    return true;
  }

  async newMessage(createMsgDto: CreateMessageDto): Promise<Message> {
    const { sender_id, room_id, message } = createMsgDto;
    const user = await this.userRepo.findOneBy({ Id: sender_id });
    if (!user) throw new WsException('Sender user not found...');

    const room = await this.roomRepo.findOneBy({ Id: room_id });
    if (!room) return;

    const date = new Date();
    const raw_msg = this.msgRepo.create();
    raw_msg.room = room;
    raw_msg.user = user;
    raw_msg.send_date = date;
    raw_msg.message = message;

    return await this.msgRepo.save(raw_msg);
  }

  async getAllMessages(room_id: number) {
    return await this.msgRepo
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.user', 'u', 'm.room_id = :room_id', { room_id })
      .getMany();
  }

  getCients(server: Server) {
    const sockets = server.sockets.sockets;
    return Array.from(sockets).map((s) => ({ ...s[1]['user'], socket: s[0] }));
  }
}
