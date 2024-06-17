import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, CreateUserResponseDto } from '../users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface IPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private user: UsersService,
    private jwt: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    } else if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid Password');
    }
    delete user.password;
    const payload = { sub: user.id, email: user.email };
    return { user, access_token: await this.jwt.signAsync(payload) };
  }

  async validateUser(payload: IPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    delete user.password;
    return user;
  }

  async register(
    registerUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const existingUser = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: registerUserDto.email,
          },
          {
            username: registerUserDto.username,
          },
        ],
      },
    });
    if (existingUser.length > 0) {
      throw new ConflictException('User already exists');
    }
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.user.create(registerUserDto);
    const payload = { sub: user.id, email: user.email };
    delete user.password;
    return { user, access_token: await this.jwt.signAsync(payload) };
  }
}
