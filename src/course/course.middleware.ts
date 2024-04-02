import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CourseService } from './course.service';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';

@Injectable()
export class UserCourseMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private jwt: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    //Req headers authorization would always come in the form of 'Bearer ...' so i'm cutting it out
    const authorization = await this.jwt.decode(
      req.headers.authorization.replace('Bearer ', ''),
    );

    const course = await this.courseService.findCourse(parseInt(req.params.id));
    const user = await this.userService.findUser(authorization.email);

    if (
      course.message.userId !== user.message.id &&
      user.message.role !== 'admin'
    ) {
      throw new ForbiddenException('User cannot access this course');
    }
    next();
  }
}
