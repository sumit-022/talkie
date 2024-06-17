import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationController } from './conversation.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [ConversationService, EventEmitter2],
  imports: [PrismaModule],
  controllers: [ConversationController],
})
export class ConversationModule {}
