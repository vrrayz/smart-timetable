import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { ClassScheduleDto, ClassScheduleUpdateDto } from './classes.dto';
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

  @UseGuards(AuthGuard('jwt'))
  @Get('userClasses')
  userClasses(@Req() req: UserRequest) {
    return this.classesService.findUserClasses(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  updateClass(
    // @Req() req: UserRequest,
    @Body() classesDto: ClassScheduleUpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
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
    return this.classesService.updateClassesSchedule(
      classesDto,
      classesDto.schedule,
      id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteTerm(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.deleteClassesSchedule(id);
  }
}
