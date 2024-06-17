import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    const data = await this.authService.login(loginDto);
    return res.json(data);
  }
  @Post('register')
  async register(@Body() registerDto: CreateUserDto, @Res() res: Response) {
    const data = await this.authService.register(registerDto);
    return res.json(data);
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Res() res: Response, @Req() req: Request) {
    const payload = req.user;
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return res.json(user);
  }
}
