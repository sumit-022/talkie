import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationDto {
  @IsNotEmpty()
  @IsString()
  recipientId: string;
}
