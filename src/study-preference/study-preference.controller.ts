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
  constructor(private studyPreferenceService: StudyPreferenceService) {}

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
