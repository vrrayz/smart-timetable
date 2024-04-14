import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';
import { StudyPreferenceService } from 'src/study-preference/study-preference.service';
import { CourseService } from 'src/course/course.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [TimetableController],
  providers: [
    TimetableService,
    StudyPreferenceService,
    CourseService,
    PrismaService,
    UserService,
  ],
})
export class TimetableModule {}
