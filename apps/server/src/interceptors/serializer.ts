import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { map } from 'rxjs';
import { IUser } from '../users/users.service';

export interface IConevrsation {
  id: string;
  name: string;
  creatorId: string;
  messages: {
    creator: IUser;
    creatorId: string;
    content: string;
    id: string;
    createdAt: Date;
  }[];
}

export class SerializerConversationDto {
  id: string;
  name: string;
  creatorId: string;
  recepientId: string;
  @Exclude()
  messages: {
    creator: IUser;
    creatorId: string;
    content: string;
    id: string;
    createdAt: Date;
  }[];
  @Expose({ name: 'lastMessage' })
  get lastMessage() {
    return this.messages[this.messages.length - 1];
  }
  constructor(properties: Partial<SerializerConversationDto>) {
    Object.assign(this, properties);
  }
}

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => new SerializerConversationDto(item));
        }
        return new SerializerConversationDto(data);
      }),
    );
  }
}
