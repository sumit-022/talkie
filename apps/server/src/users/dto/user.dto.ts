import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import { User } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class CreateUserResponseDto {
  user: Omit<User, 'password'>;
  access_token: string;
}
