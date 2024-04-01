import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async showUsers() {
    const users = await this.prismaService.user.findMany({
      select: { name: true, email: true, createdAt: true },
    });
    return { statusCode: 200, message: users };
  }
  async findUser(email: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          email: true,
        },
      });

      return { statusCode: 200, message: user };
    } catch (error) {
      if (error.code == 'P2025')
        throw new ForbiddenException('Incorrect Credentials');
      throw error;
    }
  }
}
