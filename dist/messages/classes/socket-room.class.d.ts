export declare class SocketRoom {
    db_id: number;
    socket_name: string;
    name: string;
    constructor(db_id: number, name: string);
    createName(db_id: number): string;
}
