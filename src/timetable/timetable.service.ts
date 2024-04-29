import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  TimetableCreateDto,
  TimetableDto,
  TimetableUpdateDto,
} from './timetable.dto';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

@Injectable()
export class TimetableService {
  private MILLISECONDS = 1000;
  private AN_HOUR_IN_MILLISECONDS = 3600 * this.MILLISECONDS;
  private A_MINUTE_IN_MILLISECONDS = 60 * this.MILLISECONDS;

  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async createTimetable(data: TimetableDto) {
    try {
      const course = await this.prismaService.timeTable.create({
        data: {
          userId: data.userId,
          termId: data.termId,
          courseId: data.courseId,
          repeat: data.repeat,
          schedule: {
            create: data.schedule.map((dto) => {
              return {
                days: dto.days,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                userId: data.userId,
                termId: data.termId,
                startTime: dto.startTime,
                endTime: dto.endTime,
              };
            }),
          },
        },
      });
      return { statusCode: 200, message: course };
    } catch (error) {
      throw error;
    }
  }

  async addTimetableSchedule(
    email: string,
    timetableData: TimetableCreateDto,
    scheduleData: ScheduleDto[],
  ) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      try {
        const timetableSchedule = await this.prismaService.timeTable.create({
          data: {
            ...timetableData,
            userId: user.message.id,
            schedule: {
              create: scheduleData.map((dto) => {
                return {
                  days: dto.days,
                  startDate: new Date(dto.startDate),
                  endDate: new Date(dto.endDate),
                  userId: user.message.id,
                  termId: timetableData.termId,
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
        return { statusCode: 200, message: timetableSchedule };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error creating schedule');
  }

  async findUserTimetable(email: string) {
    try {
      const userTimetable = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        select: {
          timetable: {
            include: {
              Course: true,
              schedule: true,
            },
          },
        },
      });

      return { statusCode: 200, message: userTimetable };
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException('User not found');
      throw error;
    }
  }
  async updateTimetableSchedule(
    timetableData: TimetableUpdateDto,
    scheduleData: ScheduleUpdateDto[],
    id: number,
  ) {
    const { courseId, repeat } = timetableData;
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
      const timetableSchedule = await this.prismaService.timeTable.update({
        where: {
          id,
        },
        data: {
          courseId,
          repeat,
        },
        include: {
          Course: true,
        },
      });
      return { statusCode: 200, message: timetableSchedule };
    } catch (error) {
      throw error;
    }
  }

  async deleteTimetableSchedule(id: number) {
    await this.prismaService.timeTable.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Timetable Deleted' };
  }
  toDigitalClock(timeInMilliseconds: number) {
    // Digital Clock conversion logic
    const hour = Math.floor(
      timeInMilliseconds / this.AN_HOUR_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const minute = Math.floor(
      (timeInMilliseconds % this.AN_HOUR_IN_MILLISECONDS) /
        this.A_MINUTE_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const time = `${hour}:${minute}`;
    return time;
  }
}
