import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Comment } from 'src/models/comments.model';

@WebSocketGateway({ transports: ['websocket'] })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('topic')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    client.join(payload);
  }

  @OnEvent('comment.created')
  handleOrderCreatedEvent(payload: Comment) {
    this.server.to(payload.topic.toString()).emit('newComment', payload);
  }
}
