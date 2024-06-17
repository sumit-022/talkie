import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';

export interface SocketUser extends Socket {
  user: User;
}

@Injectable()
export class SocketService {
  private sockets: Map<string, SocketUser> = new Map();

  addSocket(id: string, socket: SocketUser) {
    this.sockets.set(id, socket);
  }

  removeSocket(id: string) {
    this.sockets.delete(id);
  }

  getSocket(id: string): SocketUser {
    return this.sockets.get(id);
  }
}
