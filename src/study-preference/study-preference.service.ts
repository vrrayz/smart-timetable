import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { StudyPreferenceDto } from './study-preference.dto';

@Injectable()
export class StudyPreferenceService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async createStudyPreference(email: string, data: StudyPreferenceDto) {
    const studyPreference = await this.findUserStudyPreference(email);
    if (
      studyPreference.statusCode === 200 &&
      studyPreference.message === null
    ) {
      const user = await this.userService.findUser(email);
      if (user.statusCode === 200) {
        try {
          const studyPreference =
            await this.prismaService.studyPreference.create({
              data: { ...data, userId: user.message.id },
            });
          return { statusCode: 200, message: studyPreference };
        } catch (error) {
          throw error;
        }
      }
    }
    throw new ForbiddenException('Error creating study preference');
  }
  async findUserStudyPreference(email: string) {
    const user = await this.userService.findUser(email);
    if (user.statusCode === 200) {
      const userStudyPreference =
        await this.prismaService.studyPreference.findUnique({
          where: { userId: user.message.id },
        });
      return { statusCode: 200, message: userStudyPreference };
    }
    throw new ForbiddenException('Error fetching user data');
  }
  async findStudyPreference(id: number) {
    try {
      const studyPreference =
        await this.prismaService.studyPreference.findUniqueOrThrow({
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

      return { statusCode: 200, message: studyPreference };
    } catch (error) {
      if (error.code == 'P2025')
        throw new ForbiddenException('Study Preference not found');
      throw error;
    }
  }
  async updateStudyPreference(data: StudyPreferenceDto, id: number) {
    const studyPreference = await this.prismaService.studyPreference.update({
      where: {
        id,
      },
      data,
    });
    return { statusCode: 200, message: studyPreference };
  }
  async deleteStudyPreference(id: number) {
    await this.prismaService.studyPreference.delete({
      where: {
        id,
      },
    });
    return { statusCode: 200, message: 'Study Preference Deleted' };
  }
}
