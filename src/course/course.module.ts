import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserCourseMiddleware } from './course.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CourseService, PrismaService, UserService, JwtService],
  controllers: [CourseController],
})
export class CourseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserCourseMiddleware)
      .forRoutes('/course/edit/:id', '/course/delete/:id');
  }
}
