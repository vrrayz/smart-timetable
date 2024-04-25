import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ClassScheduleDto } from './classes.dto';
import { ScheduleDto } from 'src/schedule/schedule.dto';

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
        const studyPreference = await this.prismaService.class.create({
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
            schedule: true,
          },
        });
        return { statusCode: 200, message: studyPreference };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('Error creating study preference');
  }
}
