"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("./entities/message.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const websockets_1 = require("@nestjs/websockets");
const room_entity_1 = require("./entities/room.entity");
let MessagesService = exports.MessagesService = class MessagesService {
    constructor(msgRepo, userRepo, roomRepo) {
        this.msgRepo = msgRepo;
        this.userRepo = userRepo;
        this.roomRepo = roomRepo;
    }
    newConnection(server) {
        return this.getCients(server);
    }
    async getRooms(user_id) {
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
    async newRoom(data) {
        const { name, user_ids } = data;
        const raw_room = await this.roomRepo.create();
        raw_room.name = name;
        const users = [];
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
    async joinRooms(room_ids, user_socket, user_id) {
        for (const id of room_ids) {
            const room = await this.roomRepo.findOne({
                where: { Id: id },
                relations: ['users'],
            });
            if (!room)
                return;
            const user = await this.userRepo.findOneBy({ Id: user_id });
            if (!user)
                return;
            room.users.push(user);
            const saved = await this.roomRepo.save(room);
            if (!saved)
                return;
            const socket_room_name = 'room_' + id;
            user_socket.join(socket_room_name);
        }
        return true;
    }
    async leaveRoom(user_socket, room_id, user_id) {
        const room = await this.roomRepo.findOneBy({ Id: room_id });
        if (!room)
            return;
        const index = room.users.findIndex((u) => u.Id == user_id);
        if (index < 0)
            return;
        room.users.splice(index);
        const saved = await this.roomRepo.save(room);
        if (!saved)
            return;
        const room_name = 'room_' + room_id;
        user_socket.leave(room_name);
        return true;
    }
    async newMessage(createMsgDto) {
        const { sender_id, room_id, message } = createMsgDto;
        const user = await this.userRepo.findOneBy({ Id: sender_id });
        if (!user)
            throw new websockets_1.WsException('Sender user not found...');
        const room = await this.roomRepo.findOneBy({ Id: room_id });
        if (!room)
            return;
        const date = new Date();
        const raw_msg = this.msgRepo.create();
        raw_msg.room = room;
        raw_msg.user = user;
        raw_msg.send_date = date;
        raw_msg.message = message;
        return await this.msgRepo.save(raw_msg);
    }
    async getAllMessages(room_id) {
        return await this.msgRepo
            .createQueryBuilder('m')
            .innerJoinAndSelect('m.user', 'u', 'm.room_id = :room_id', { room_id })
            .getMany();
    }
    getCients(server) {
        const sockets = server.sockets.sockets;
        return Array.from(sockets).map((s) => ({ ...s[1]['user'], socket: s[0] }));
    }
};
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map