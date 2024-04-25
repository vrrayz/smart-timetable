import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CourseModule } from './course/course.module';
import { TermModule } from './term/term.module';
import { StudyPreferenceModule } from './study-preference/study-preference.module';
import { TimetableModule } from './timetable/timetable.module';
import { ClassesModule } from './classes/classes.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), CourseModule, TermModule, StudyPreferenceModule, TimetableModule, ClassesModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule {}
