import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/message.dto';
import { IUser } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createMessage(messageDto: CreateMessageDto, user: IUser) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: messageDto.conversationId,
        OR: [{ creatorId: user.sub }, { recipientId: user.sub }],
      },
    });
    if (!conversation) {
      throw new HttpException('Conversation not found', 404);
    }
    const message = await this.prisma.conversationMessage.create({
      data: {
        content: messageDto.content,
        senderId: user.sub,
        conversationId: messageDto.conversationId,
      },
      include: {
        sender: true,
      },
    });
    this.eventEmitter.emit('message.created', message);
    return message;
  }

  async deleteMessage(messageId: number, user: IUser) {}
}
