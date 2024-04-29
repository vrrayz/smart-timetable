import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CourseDto } from './course.dto';

@Injectable()
export class CourseService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async createCourse(email: string, data: CourseDto) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const course = await this.prismaService.course.create({
          data: { ...data, userId: user.message.id },
        });
        return { statusCode: 200, message: course };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error fetching user data');
  }
  async findCourse(id: number) {
    try {
      const course = await this.prismaService.course.findUniqueOrThrow({
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

      return { statusCode: 200, message: course };
    } catch (error) {
      if (error.code == 'P2025')
        throw new ForbiddenException('Course not found');
      throw error;
    }
  }
  async findUserCourses(email: string) {
    try {
      const userCourses = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          courses: {
            select: {
              id: true,
              title: true,
              courseCode: true,
              termId: true,
              userId: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userCourses };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async findUserCoursesByTerm(email: string, termId: number) {
    try {
      const userCourses = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          courses: {
            where: {
              termId,
            },
            select: {
              id: true,
              title: true,
              courseCode: true,
              termId: true,
              userId: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userCourses };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async updateCourse(data: CourseDto, id: number) {
    const course = await this.prismaService.course.update({
      where: {
        id,
      },
      data,
    });
    return { statusCode: 200, message: course };
  }
  async deleteCourse(id: number) {
    await this.prismaService.course.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Course Deleted' };
  }
}
