import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ClassesService, PrismaService, UserService],
  controllers: [ClassesController],
})
export class ClassesModule {}
