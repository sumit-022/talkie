import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketUser, SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from 'src/auth/auth.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    const payload = this.jwtService.verify(token) as IPayload;
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const socket = client as SocketUser;
    socket.user = user;
    this.socketService.addSocket(user.id, socket);
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    const payload = this.jwtService.verify(token) as IPayload;
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    this.socketService.removeSocket(payload.sub);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: SocketUser,
  ) {
    const socket = this.socketService.getSocket(client.user.id);
    if (!socket) {
      throw new NotFoundException('Socket not found');
    }
    socket.emit('message', data);
  }

  @OnEvent('message')
  async onMessage(data: string, userId: string) {
    const socket = this.socketService.getSocket(userId);
    if (!socket) {
      throw new NotFoundException('Socket not found');
    }
    socket.emit('message', data);
  }
}
