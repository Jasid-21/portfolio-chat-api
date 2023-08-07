import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    console.log(client.handshake.headers.authorization);
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];

    if (!type || !token || type != 'Bearer')
      throw new WsException('Unauthorized');

    try {
      const payload = this.jwtService.verify(token);
      client['user'] = payload;
    } catch (err) {
      throw new WsException('Unauthorized');
    }
    return true;
  }
}
