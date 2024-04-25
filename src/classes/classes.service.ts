import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ClassScheduleDto, ClassScheduleUpdateDto } from './classes.dto';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

@Injectable()
export class ClassesService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async createClassSchedule(
    email: string,
    classData: ClassScheduleDto,
    scheduleData: ScheduleDto[],
  ) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const classSchedule = await this.prismaService.class.create({
          data: {
            ...classData,
            userId: user.message.id,
            schedule: {
              create: scheduleData.map((dto) => {
                return {
                  days: dto.days,
                  startDate: new Date(dto.startDate),
                  endDate: new Date(dto.endDate),
                  userId: user.message.id,
                  termId: classData.termId,
                };
              }),
            },
          },
          include: {
            Course: true,
            schedule: true,
          },
        });
        return { statusCode: 200, message: classSchedule };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error creating study preference');
  }
  async findUserClasses(email: string) {
    try {
      const userClasses = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          class: {
            include: {
              Course: true,
              schedule: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userClasses };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async updateClassesSchedule(
    classData: ClassScheduleUpdateDto,
    scheduleData: ScheduleUpdateDto[],
    id: number,
  ) {
    const { courseId, room, building, lecturer, repeat } = classData;
    // delete classData.termId;
    try {
      await scheduleData.forEach(async (scheduleDto) => {
        const newSchedule = await this.prismaService.schedule.update({
          where: {
            id: scheduleDto.id,
          },
          data: {
            days: scheduleDto.days,
            startDate: new Date(scheduleDto.startDate),
            endDate: new Date(scheduleDto.endDate),
          },
        });
        return newSchedule;
      });
      const classesSchedule = await this.prismaService.class.update({
        where: {
          id,
        },
        data: {
          courseId,
          room,
          building,
          lecturer,
          repeat,
        },
        include: {
          Course: true,
        },
      });
      return { statusCode: 200, message: classesSchedule };
    } catch (error) {
      throw error;
    }
  }
  async deleteClassesSchedule(id: number) {
    await this.prismaService.class.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Class Deleted' };
  }
}
