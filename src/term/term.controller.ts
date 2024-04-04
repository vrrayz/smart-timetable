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
import { TermService } from './term.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/user/user.types';
import { TermDto } from './term.dto';

@Controller('term')
export class TermController {
  constructor(private termService: TermService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() req: UserRequest, @Body() termDto: TermDto) {
    // if(termDto.)
    const startDate = new Date(termDto.startDate).getTime();
    const endDate = new Date(termDto.endDate).getTime();
    if (startDate >= endDate)
      throw new HttpException('Invalid Date Parameters', 400);
    return this.termService.createTerm(req.user.email, termDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userTerms')
  userTerms(@Req() req: UserRequest) {
    return this.termService.findUserTerms(req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  editTerm(@Body() termDto: TermDto, @Param('id', ParseIntPipe) id: number) {
    return this.termService.updateTerm(termDto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteTerm(@Param('id', ParseIntPipe) id: number) {
    return this.termService.deleteTerm(id);
  }
}
