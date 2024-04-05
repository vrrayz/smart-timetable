import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';
import { StudyPreferenceService } from './study-preference.service';

@Injectable()
export class StudyPreferenceMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private studyPreferenceService: StudyPreferenceService,
    private jwt: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    //Req headers authorization would always come in the form of 'Bearer ...' so i'm cutting it out
    const authorization = await this.jwt.decode(
      req.headers.authorization.replace('Bearer ', ''),
    );

    const studyPreference =
      await this.studyPreferenceService.findStudyPreference(
        parseInt(req.params.id),
      );
    const user = await this.userService.findUser(authorization.email);

    if (
      studyPreference.message.userId !== user.message.id &&
      user.message.role !== 'admin'
    ) {
      throw new ForbiddenException('User cannot access this Preference');
    }
    next();
  }
}
