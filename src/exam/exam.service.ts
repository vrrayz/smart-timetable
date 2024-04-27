import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ExamScheduleDto, ExamScheduleUpdateDto } from './exam.dto';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

@Injectable()
export class ExamService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async createExamSchedule(
    email: string,
    examData: ExamScheduleDto,
    scheduleData: ScheduleDto[],
  ) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const examSchedule = await this.prismaService.exam.create({
          data: {
            ...examData,
            userId: user.message.id,
            schedule: {
              create: scheduleData.map((dto) => {
                return {
                  days: dto.days,
                  startDate: new Date(dto.startDate),
                  endDate: new Date(dto.endDate),
                  userId: user.message.id,
                  termId: examData.termId,
                  startTime: dto.startTime,
                  endTime: dto.endTime,
                };
              }),
            },
          },
          include: {
            Course: true,
            schedule: true,
          },
        });
        return { statusCode: 200, message: examSchedule };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error creating schedule');
  }

  async findUserExams(email: string) {
    try {
      const userExams = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          exam: {
            include: {
              Course: true,
              schedule: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userExams };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }

  async updateExamSchedule(
    classData: ExamScheduleUpdateDto,
    scheduleData: ScheduleUpdateDto[],
    id: number,
  ) {
    const { courseId, room, building } = classData;
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
            startTime: scheduleDto.startTime,
            endTime: scheduleDto.endTime,
          },
        });
        return newSchedule;
      });
      const examSchedule = await this.prismaService.exam.update({
        where: {
          id,
        },
        data: {
          courseId,
          room,
          building,
        },
        include: {
          Course: true,
        },
      });
      return { statusCode: 200, message: examSchedule };
    } catch (error) {
      throw error;
    }
  }

  async deleteExamSchedule(id: number) {
    await this.prismaService.exam.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Exam Deleted' };
  }
}
