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
import { ExamService } from './exam.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { ExamScheduleDto, ExamScheduleUpdateDto } from './exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() req: UserRequest, @Body() examDto: ExamScheduleDto) {
    // if(termDto.)
    examDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      //console.log(scheduleKeys);
      //console.log(examDto.schedule);
      if (
        scheduleKeys.indexOf('endDate') === -1 ||
        scheduleKeys.indexOf('startDate') === -1 ||
        scheduleKeys.indexOf('days') === -1 ||
        scheduleKeys.indexOf('endTime') === -1 ||
        scheduleKeys.indexOf('startTime') === -1
      )
        throw new HttpException('Invalid schedule parameters', 400);

      const startDate = new Date(schedule.startDate).getTime();
      const endDate = new Date(schedule.endDate).getTime();
      if (startDate > endDate || schedule.startTime >= schedule.endTime)
        throw new HttpException('Invalid Date / Time Parameters', 400);
    });
    return this.examService.createExamSchedule(
      req.user.email,
      examDto,
      examDto.schedule,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userExams')
  userExams(@Req() req: UserRequest) {
    return this.examService.findUserExams(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  updateExams(
    // @Req() req: UserRequest,
    @Body() examDto: ExamScheduleUpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // if(termDto.)
    examDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      //console.log(scheduleKeys);
      //console.log(examDto.schedule);
      if (
        scheduleKeys.indexOf('endDate') === -1 ||
        scheduleKeys.indexOf('startDate') === -1 ||
        scheduleKeys.indexOf('days') === -1 ||
        scheduleKeys.indexOf('endTime') === -1 ||
        scheduleKeys.indexOf('startTime') === -1
      )
        throw new HttpException('Invalid schedule parameters', 400);

      const startDate = new Date(schedule.startDate).getTime();
      const endDate = new Date(schedule.endDate).getTime();
      if (startDate > endDate || schedule.startTime >= schedule.endTime)
        throw new HttpException('Invalid Date / Time Parameters', 400);
    });
    return this.examService.updateExamSchedule(examDto, examDto.schedule, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteExam(@Param('id', ParseIntPipe) id: number) {
    return this.examService.deleteExamSchedule(id);
  }
}
