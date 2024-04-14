import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from 'src/course/course.service';
import { StudyPreferenceService } from 'src/study-preference/study-preference.service';
import { UserRequest } from 'src/user/user.types';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(
    private courseService: CourseService,
    private studyPreferenceService: StudyPreferenceService,
    private timeTableService: TimetableService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('generate')
  async generateTimetable(@Req() req: UserRequest) {
    const userCoursesQuery = await this.courseService.findUserCourses(
      req.user.email,
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
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };
      const daysOfTheWeek = Object.keys(timetable);
      const timeToSpend = studyPreference.endTime - studyPreference.startTime;
      const timePerCourse = timeToSpend / studyPreference.coursesPerDay;
      const breakTime = 0.3 * timeToSpend; //allocate 30%
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
            startTime: this.timeTableService.toDigitalClock(
              currentCourseStartTime,
            ),
            endTime: this.timeTableService.toDigitalClock(currentCourseEndTime),
          };
          timetable[daysOfTheWeek[index]].push(element);
          if (subIndex !== daysOfTheWeek.length - 1) {
            const breakTimeElement = {
              break: this.timeTableService.toDigitalClock(breakTimePerCourse),
            };
            timetable[daysOfTheWeek[index]].push(breakTimeElement);
          }
          currentCourseStartTime = currentCourseEndTime + breakTimePerCourse;
        }
      }
      return { data: timetable };
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
