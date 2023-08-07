import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { Room } from 'src/messages/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Room])],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
