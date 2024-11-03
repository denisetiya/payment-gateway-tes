import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // Fungsi untuk membuat user baru
  async createNewUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  // Fungsi untuk menemukan user berdasarkan email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Fungsi untuk validasi user saat login
  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Generate Access Token
  async generateAccessToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  // Generate Refresh Token dan simpan di database
  async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' }); // Berlaku 7 hari
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
    return refreshToken;
  }

  // Validasi Refresh Token
  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return user;
  }
}
