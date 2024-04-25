import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, UserService, PrismaService],
})
export class ExamModule {}
