import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

/**
 * `AppGateway` use for socket.IO
 *
 * @author asraful
 * @version 1.0.0
 * @since 1.0.0
 */
@WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer() wss;
  handleConnection(client: any, ...args: any[]) {
    client.emit('connection', 'ok for go ' + new Date() + '');
  }
}
