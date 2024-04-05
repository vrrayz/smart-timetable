import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StudyPreferenceController } from './study-preference.controller';
import { StudyPreferenceService } from './study-preference.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { StudyPreferenceMiddleware } from './study-preference.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StudyPreferenceController],
  providers: [StudyPreferenceService, PrismaService, UserService, JwtService],
})
export class StudyPreferenceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StudyPreferenceMiddleware)
      .forRoutes('/study-preference/edit/:id', '/study-preference/delete/:id');
  }
}
