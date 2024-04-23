import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserRequest } from './user.types';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('myprofile')
  profile(@Req() req: UserRequest) {
    return this.userService.findUser(req.user.email);
  }
}
