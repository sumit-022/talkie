import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationDto } from './dto/conversation.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUser } from 'src/users/users.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createConversation(conversationDto: ConversationDto, user: IUser) {
    if (conversationDto.recipientId === user.sub) {
      throw new HttpException('Cannot create conversation with yourself', 400);
    }
    const recipient = await this.prisma.user.findUnique({
      where: {
        id: conversationDto.recipientId,
      },
    });
    if (!recipient) {
      throw new HttpException('Recipient not found', 404);
    }
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { creatorId: user.sub, recipientId: conversationDto.recipientId },
          { creatorId: conversationDto.recipientId, recipientId: user.sub },
        ],
      },
    });
    if (existing) {
      return existing;
    }
    const conversation = await this.prisma.conversation.create({
      data: {
        creatorId: user.sub,
        recipientId: conversationDto.recipientId,
      },
    });
    this.eventEmitter.emit('conversation.created', conversation);
    return conversation;
  }

  async getConversationMessagesById(conversationId: string, user: IUser) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ creatorId: user.sub }, { recipientId: user.sub }],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!conversation) {
      throw new HttpException('Conversation not found', 404);
    }
    return conversation;
  }

  async getConversationPeopleById(id: string, user: IUser) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, OR: [{ creatorId: user.sub }, { recipientId: user.sub }] },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: true },
          skip: 0,
          take: 10,
        },
      },
    });
    if (!conversation) {
      throw new HttpException('No conversation found', 400);
    }
    return conversation;
  }

  async getConversations(user: IUser) {
    return await this.prisma.conversation.findMany({
      where: {
        OR: [{ creatorId: user.sub }, { recipientId: user.sub }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          skip: 0,
          take: 1,
          include: { sender: true },
        },
      },
    });
  }

  async deleteAllConversations() {
    return await this.prisma.conversation.deleteMany();
  }
}
