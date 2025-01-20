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
    client.leave(client.data.topic);
    client.join(payload);
    client.data.topic = payload;
  }

  @OnEvent('comment.created')
  sendNewComment(payload: Comment) {
    this.server.to(payload.topic.toString()).emit('newComment', payload);
  }

  @OnEvent('topic.created')
  sendNewTopic(payload: Comment) {
    this.server.emit('newTopic', payload);
  }
}
