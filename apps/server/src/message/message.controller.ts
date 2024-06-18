import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/users/users.service';

@Controller('message')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post()
  async createMessage(
    @Body() messageDto: CreateMessageDto,
    @AuthUser() user: IUser,
  ) {
    return this.messageService.createMessage(messageDto, user);
  }
}
