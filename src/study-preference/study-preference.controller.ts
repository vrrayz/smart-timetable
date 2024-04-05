import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudyPreferenceDto } from './study-preference.dto';
import { UserRequest } from 'src/user/user.types';
import { StudyPreferenceService } from './study-preference.service';

@Controller('study-preference')
export class StudyPreferenceController {
  private MILLISECONDS = 1000;
  private AN_HOUR_IN_MILLISECONDS = 3600 * this.MILLISECONDS;
  private A_MINUTE_IN_MILLISECONDS = 60 * this.MILLISECONDS;
  constructor(private studyPreferenceService: StudyPreferenceService) {}

  clockLogic(@Body() reqBody: any) {
    // Digital Clock conversion logic
    const hour = Math.floor(
      reqBody.startTime / this.AN_HOUR_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const minute = Math.floor(
      (reqBody.startTime % this.AN_HOUR_IN_MILLISECONDS) /
        this.A_MINUTE_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const time = `${hour}:${minute}`;
    return { message: 'success', data: time };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(
    @Req() req: UserRequest,
    @Body() studyPreferenceDto: StudyPreferenceDto,
  ) {
    return this.studyPreferenceService.createStudyPreference(
      req.user.email,
      studyPreferenceDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  userStudyPreference(@Req() req: UserRequest) {
    return this.studyPreferenceService.findUserStudyPreference(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  editStudyPreference(
    @Body() studyPreferenceDto: StudyPreferenceDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studyPreferenceService.updateStudyPreference(
      studyPreferenceDto,
      id,
    );
  }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Delete('delete/:id')
  //   deleteStudyPreference(@Param('id', ParseIntPipe) id: number) {
  //     return this.studyPreferenceService.deleteStudyPreference(id);
  //   }
}
