import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { TaskScheduleDto, TaskScheduleUpdateDto } from './task.dto';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

@Injectable()
export class TaskService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async createTaskSchedule(
    email: string,
    taskSchedule: TaskScheduleDto,
    scheduleData: ScheduleDto[],
  ) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const classSchedule = await this.prismaService.task.create({
          data: {
            ...taskSchedule,
            userId: user.message.id,
            schedule: {
              create: scheduleData.map((dto) => {
                return {
                  days: dto.days,
                  startDate: new Date(dto.startDate),
                  endDate: new Date(dto.endDate),
                  userId: user.message.id,
                };
              }),
            },
          },
          include: {
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
  async findUserTasks(email: string) {
    try {
      const userTasks = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          task: {
            include: {
              schedule: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userTasks };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async updateTaskSchedule(
    classData: TaskScheduleUpdateDto,
    scheduleData: ScheduleUpdateDto[],
    id: number,
  ) {
    const { title, detail } = classData;
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
      const taskSchedule = await this.prismaService.task.update({
        where: {
          id,
        },
        data: {
          title,
          detail,
        },
      });
      return { statusCode: 200, message: taskSchedule };
    } catch (error) {
      throw error;
    }
  }
  async deleteTaskSchedule(id: number) {
    await this.prismaService.task.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Task Deleted' };
  }
}
