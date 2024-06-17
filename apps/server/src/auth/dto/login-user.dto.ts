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
  user: Omit<User, 'password'>;
  access_token: string;
}
