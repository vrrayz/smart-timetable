import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from 'src/course/course.service';
import { StudyPreferenceService } from 'src/study-preference/study-preference.service';
import { UserRequest } from 'src/user/user.types';

@Controller('timetable')
export class TimetableController {
  constructor(
    private courseService: CourseService,
    private studyPreferenceService: StudyPreferenceService,
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
      for (let index = 0; index < daysOfTheWeek.length; index++) {
        for (
          let subIndex = 0;
          subIndex < studyPreference.coursesPerDay;
          subIndex++
        ) {
          if (coursesDuplicate.length === 0) coursesDuplicate = [...courses];
          const randomIndex = Math.floor(
            Math.random() * coursesDuplicate.length,
          );
          const element = coursesDuplicate.splice(randomIndex, 1)[0];
          timetable[daysOfTheWeek[index]].push(element);
        }
      }
      return { data: timetable };
    }
  }
}
