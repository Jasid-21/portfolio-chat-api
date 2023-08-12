"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRoom = void 0;
class SocketRoom {
    constructor(db_id, name) {
        this.db_id = db_id;
        this.name = name;
        this.socket_name = this.createName(db_id);
    }
    createName(db_id) {
        return 'room_' + db_id;
    }
}
exports.SocketRoom = SocketRoom;
//# sourceMappingURL=socket-room.class.js.map