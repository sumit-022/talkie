import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [UsersModule, AuthModule, ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
