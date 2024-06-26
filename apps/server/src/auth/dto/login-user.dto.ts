import { IsNotEmpty, IsString, Min, Matches } from 'class-validator';
import { User } from '@prisma/client';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginUserResponseDto {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
  };
  access_token: string;
}
