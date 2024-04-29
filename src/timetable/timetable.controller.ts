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
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from 'src/course/course.service';
import { StudyPreferenceService } from 'src/study-preference/study-preference.service';
import { UserRequest } from 'src/user/user.types';
import { TimetableService } from './timetable.service';
import {
  TimetableCreateDto,
  TimetableDto,
  TimetableUpdateDto,
} from './timetable.dto';

@Controller('timetable')
export class TimetableController {
  constructor(
    private courseService: CourseService,
    private studyPreferenceService: StudyPreferenceService,
    private timeTableService: TimetableService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUserTimetable(@Req() req: UserRequest) {
    return this.timeTableService.findUserTimetable(req.user.email);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  add(@Req() req: UserRequest, @Body() timetableDto: TimetableCreateDto) {
    // if(termDto.)
    timetableDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      //console.log(scheduleKeys);
      //console.log(timetableDto.schedule);
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
    return this.timeTableService.addTimetableSchedule(
      req.user.email,
      timetableDto,
      timetableDto.schedule,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  updateTimetable(
    // @Req() req: UserRequest,
    @Body() timetableDto: TimetableUpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // if(termDto.)
    timetableDto.schedule.map((schedule) => {
      const scheduleKeys = Object.keys(schedule);
      //console.log(scheduleKeys);
      //console.log(timetableDto.schedule);
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
    return this.timeTableService.updateTimetableSchedule(
      timetableDto,
      timetableDto.schedule,
      id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('generate/:id')
  async generateTimetable(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userCoursesQuery = await this.courseService.findUserCoursesByTerm(
      req.user.email,
      id,
    );
    const studyPreferenceQuery =
      await this.studyPreferenceService.findUserStudyPreference(req.user.email);
    if (
      userCoursesQuery.statusCode === 200 &&
      studyPreferenceQuery.statusCode === 200
    ) {
      // minimum timestamp should be 1 hour
      // generate using the courses per day
      /**
       * const array = [Course1]
       * let arrayDuplicate = [...array] // this would be for manipulation
       * const timetable = {Monday: [], Tuesday: [], Wednesday: [] ...}
       * for i in Object.keys of timetable (Days of the week)
       * for i in coursesPerDay
       * if arrayDuplicate is empty. fill it back up with as arrayDuplicate = [...array]
       * check if arrayDuplicate is empty. if it isn't randomly select one item and push into the particular key's value
       */
      const studyPreference = studyPreferenceQuery.message;
      const courses = userCoursesQuery.message.courses;
      let coursesDuplicate = [...courses];
      const timetable = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };
      const daysOfTheWeek = Object.keys(timetable);
      const timeToSpend = studyPreference.endTime - studyPreference.startTime;
      const timePerCourse = timeToSpend / studyPreference.coursesPerDay;
      const breakTime = (studyPreference.breaksPerDay / 100) * timeToSpend; //allocate 30%
      const breakTimePerCourse = breakTime / studyPreference.coursesPerDay;
      for (let index = 0; index < daysOfTheWeek.length; index++) {
        let currentCourseStartTime = 0;
        let currentCourseEndTime = 0;
        for (
          let subIndex = 0;
          subIndex < studyPreference.coursesPerDay;
          subIndex++
        ) {
          if (coursesDuplicate.length === 0) coursesDuplicate = [...courses];
          const randomIndex = Math.floor(
            Math.random() * coursesDuplicate.length,
          );
          if (subIndex === 0)
            currentCourseStartTime = studyPreference.startTime;
          currentCourseEndTime =
            currentCourseStartTime + timePerCourse - breakTimePerCourse;
          const element = {
            ...coursesDuplicate.splice(randomIndex, 1)[0],
            startTime: currentCourseStartTime,
            endTime: currentCourseEndTime,
          };
          timetable[daysOfTheWeek[index]].push(element);
          if (subIndex !== daysOfTheWeek.length - 1) {
            const breakTimeElement = {
              break: breakTimePerCourse,
            };
            timetable[daysOfTheWeek[index]].push(breakTimeElement);
          }
          currentCourseStartTime = currentCourseEndTime + breakTimePerCourse;
        }
      }
      return { data: timetable };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('save/:id')
  async saveTimetable(
    @Body() req: any,
    @Req() userReq: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userCoursesQuery = await this.courseService.findUserCoursesByTerm(
      userReq.user.email,
      id,
    );
    userCoursesQuery.message.courses.map((course) => {
      Object.keys(req.data).forEach((key) => {
        this.setTimetableScheduleDays(req.data, key, course.id);
      });
    });
    return this.getUserTimetable(userReq);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteTerm(@Param('id', ParseIntPipe) id: number) {
    return this.timeTableService.deleteTimetableSchedule(id);
  }

  setTimetableScheduleDays(data: any, key: string, courseId: number) {
    const dayFilter = data[key].filter((item) => item.id === courseId);
    // const days = schedule.days;
    if (dayFilter.length > 0) {
      dayFilter.map((item) => {
        const timetable: TimetableDto = {
          userId: item.userId,
          termId: item.termId,
          courseId: courseId,
          repeat: true,
          schedule: [
            {
              days: key,
              startTime: item.startTime,
              endTime: item.endTime,
              startDate: new Date(),
              endDate: new Date(),
            },
          ],
        };
        this.timeTableService.createTimetable(timetable);
      });
    }
  }
}
/**
 * TIME LOGIC
 * timeToSpend = endTime - startTime
 * timePerCourse = timeToSpend / coursesPerDay
 * ==== inside the coursePerDay loop ====
 * let currentCourseStartTime = currentCourseEndTime = 0
 * if this is the first course of the day (first loop iteration)
 *    currentCourseStartTime = the startTime in study preference
 * endif
 * currentCourseEndTime = currentCourseStartTime + timePerCourse
 * push to the timetableElementObject
 * currentCourseStartTime = currentCourseEndTime
 */
