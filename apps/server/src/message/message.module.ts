import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [MessageService, EventEmitter2],
  imports: [PrismaModule],
  controllers: [MessageController],
})
export class MessageModule {}
