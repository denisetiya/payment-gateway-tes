import { Controller, Post, Body,  UnauthorizedException, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import response  from 'src/utils/Response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint Register
  @Post('register')
  async register(
    @Body() body: { email: string, password: string},
    @Res() res: Response ) {
    const userExists = await this.authService.findUserByEmail(body.email);

    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.authService.createNewUser(body.email, body.password);
    
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return response(res ,201, 'User created successfully', null,null, { accessToken, refreshToken });
  }

  // Endpoint Login
  @Post('login')
  async login(
    @Body() body: { email: string, password: string },
    @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    
    return response(res, 200, 'User logged in successfully',null,null, { accessToken, refreshToken });
  }




  // Endpoint untuk Refresh Token
  @Post('refresh')
  async refreshToken(
    @Body() body: { refreshToken: string, userId: string },
    @Res () res: Response
  ) {
    const user = await this.authService.validateRefreshToken(body.userId, body.refreshToken);
    if (!user) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    return response(res, 200, null, null, null, { accessToken });
  }
}
