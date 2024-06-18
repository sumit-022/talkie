import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { SerializerInterceptor } from 'src/interceptors/serializer';
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

  @Get()
  @UseInterceptors(ClassSerializerInterceptor, SerializerInterceptor)
  getLoggedInUserConversations(@AuthUser() user: IUser) {
    return this.conversationService.getConversations(user);
  }

  @Get(':id/messages')
  getConversationMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: IUser,
  ) {
    return this.conversationService.getConversationMessagesById(id, user);
  }
  @Get(':id')
  getConversationParticipants(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: IUser,
  ) {
    return this.conversationService.getConversationPeopleById(id, user);
  }
  @Delete()
  async deleteAllConversations() {
    return this.conversationService.deleteAllConversations();
  }
}
