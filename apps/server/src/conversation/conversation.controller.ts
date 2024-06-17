import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationService } from './conversation.service';
import { IUser } from 'src/users/users.service';

@Controller('conversation')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @AuthUser() user: IUser,
    @Body() conversationDto: ConversationDto,
  ) {
    return this.conversationService.createConversation(conversationDto, user);
  }

  @Delete()
  async deleteAllConversations() {
    return this.conversationService.deleteAllConversations();
  }
}
