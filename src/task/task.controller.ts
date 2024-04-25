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
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { TaskScheduleDto, TaskScheduleUpdateDto } from './task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() req: UserRequest, @Body() taskDto: TaskScheduleDto) {
    // if(termDto.)
    taskDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      console.log(scheduleKeys);
      console.log(taskDto.schedule);
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
    return this.taskService.createTaskSchedule(
      req.user.email,
      taskDto,
      taskDto.schedule,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userTasks')
  userTasks(@Req() req: UserRequest) {
    return this.taskService.findUserTasks(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  updateTask(
    // @Req() req: UserRequest,
    @Body() taskDto: TaskScheduleUpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // if(termDto.)
    taskDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      console.log(scheduleKeys);
      console.log(taskDto.schedule);
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
    return this.taskService.updateTaskSchedule(taskDto, taskDto.schedule, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTaskSchedule(id);
  }
}
