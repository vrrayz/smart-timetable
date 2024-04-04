import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { TermDto } from './term.dto';

@Injectable()
export class TermService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async createTerm(email: string, data: TermDto) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const term = await this.prismaService.term.create({
          data: { ...data, userId: user.message.id },
        });
        return { statusCode: 200, message: term };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error fetching user data');
  }
  async findTerm(id: number) {
    try {
      const term = await this.prismaService.term.findUniqueOrThrow({
        where: { id },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return { statusCode: 200, message: term };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('Term not found');
      throw error;
    }
  }
  async findUserTerms(email: string) {
    try {
      const userTerms = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          terms: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userTerms };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async updateTerm(data: TermDto, id: number) {
    const term = await this.prismaService.term.update({
      where: {
        id,
      },
      data,
    });
    return { statusCode: 200, message: term };
  }
  async deleteTerm(id: number) {
    await this.prismaService.term.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Term Deleted' };
  }
}
