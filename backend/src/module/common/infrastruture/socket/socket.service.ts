import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/module/user-module/infrastructure/repository/user.repository';
import { JwtHelperService } from 'src/module/user-module/infrastructure/services/jwt.service';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private activeUsers = new Map<string, string>();
    // user_uuid -> socket_id

    constructor(
        private readonly jwtHelperService: JwtHelperService,
        private readonly userRepository: UserRepository,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization;
            if (!token) {
                client.disconnect();
                return;
            }

            const decoded = await this.jwtHelperService.verifyJwtToken(token);
            const user = await this.userRepository.findByUuid(decoded.uuid);

            if (!user || user.length === 0) {
                client.disconnect();
                return;
            }

            this.activeUsers.set(decoded.uuid, client.id);
            console.log(`User connected: ${decoded.uuid}`);
        } catch (e) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        for (const [uuid, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(uuid);
                console.log(`User disconnected: ${uuid}`);
                break;
            }
        }
    }

    // send msg to receiver only
    async emitToUser(userUuid: string, event: string, data: any) {
        const socketId = this.activeUsers.get(userUuid);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
        }
    }
}
