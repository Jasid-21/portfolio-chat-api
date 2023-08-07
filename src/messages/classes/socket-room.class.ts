export class SocketRoom {
  db_id: number;
  socket_name: string;
  name: string;

  constructor(db_id: number, name: string) {
    this.db_id = db_id;
    this.name = name;
    this.socket_name = this.createName(db_id);
  }

  createName(db_id: number): string {
    return 'room_' + db_id;
  }
}
