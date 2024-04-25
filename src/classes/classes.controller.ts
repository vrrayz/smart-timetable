import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { ClassScheduleDto } from './classes.dto';
// import { ScheduleDto } from 'src/schedule/schedule.dto';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() req: UserRequest, @Body() classesDto: ClassScheduleDto) {
    // if(termDto.)
    classesDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      console.log(scheduleKeys);
      console.log(classesDto.schedule);
      if (
        scheduleKeys.indexOf('endDate') === -1 ||
        scheduleKeys.indexOf('startDate') === -1 ||
        scheduleKeys.indexOf('days') === -1
      )
        throw new HttpException('Invalid schedule parameters', 400);

      const startDate = new Date(schedule.startDate).getTime();
      const endDate = new Date(schedule.endDate).getTime();
      if (startDate >= endDate)
        throw new HttpException('Invalid Date Parameters', 400);
    });
    return this.classesService.createClassSchedule(
      req.user.email,
      classesDto,
      classesDto.schedule,
    );
  }
}
