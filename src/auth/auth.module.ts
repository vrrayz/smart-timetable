import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  providers: [AuthService, PrismaService, JwtService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
