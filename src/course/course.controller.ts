import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { CourseDto } from './course.dto';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() req: UserRequest, @Body() courseDto: CourseDto) {
    return this.courseService.createCourse(req.user.email, courseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userCourses')
  userCourses(@Req() req: UserRequest) {
    return this.courseService.findUserCourses(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  editCourse(
    @Body() courseDto: CourseDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.courseService.updateCourse(courseDto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
  }
}
