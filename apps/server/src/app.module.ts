import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UsersModule, AuthModule, ConversationModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
