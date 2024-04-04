import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TermController } from './term.controller';
import { TermService } from './term.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserTermMiddleware } from './term.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TermController],
  providers: [TermService, PrismaService, UserService, JwtService],
})
export class TermModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserTermMiddleware)
      .forRoutes('/term/edit/:id', '/term/delete/:id');
  }
}
