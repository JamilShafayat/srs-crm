import { OnGatewayConnection } from '@nestjs/websockets';
export declare class AppGateway implements OnGatewayConnection {
    wss: any;
    handleConnection(client: any, ...args: any[]): void;
}
