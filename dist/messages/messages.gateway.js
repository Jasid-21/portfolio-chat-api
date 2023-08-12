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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const wsJwtGuard_service_1 = require("../services/wsJwtGuard.service");
const common_1 = require("@nestjs/common");
let MessagesGateway = exports.MessagesGateway = class MessagesGateway {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    handleDisconnect() {
        setTimeout(() => {
            const clients = this.messagesService.getCients(this.server);
            this.server.emit('set_online_clients', clients);
        }, 500);
    }
    handleConnection(client) {
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
    async newRoom(client, data) {
        const new_room = await this.messagesService.newRoom(data);
        if (!new_room)
            return;
        const clients = this.messagesService.getCients(this.server);
        const not_me = clients.find((c) => c.Id != client['user'].Id).socket;
        if (!not_me)
            return;
        const not_me_socket = this.server.sockets.sockets.get(not_me);
        const room_name = 'room_' + new_room.Id;
        client.join(room_name);
        not_me_socket.join(room_name);
        return new_room;
    }
    joinRoom(client, room_id) {
        const id = client['user'].Id;
        return this.messagesService.joinRooms([room_id], client, id);
    }
    async getAllRooms(client) {
        const rooms = await this.messagesService.getRooms(client['user'].Id);
        const room_ids = rooms.map((r) => r.Id);
        this.messagesService.joinRooms(room_ids, client, client['user'].Id);
        return rooms;
    }
    async newMessage(client, data) {
        const message = await this.messagesService.newMessage(data);
        message.user = { ...message.user, password: null };
        const room_name = 'room_' + data.room_id;
        this.server.to(room_name).emit('new_message', message);
    }
    getAllMessages(client, room_id) {
        return this.messagesService.getAllMessages(room_id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "newRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    (0, common_1.UseGuards)(wsJwtGuard_service_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_rooms'),
    (0, common_1.UseGuards)(wsJwtGuard_service_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "getAllRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_message'),
    (0, common_1.UseGuards)(wsJwtGuard_service_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "newMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_messages'),
    (0, common_1.UseGuards)(wsJwtGuard_service_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "getAllMessages", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, { cors: { origin: '*' } }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map