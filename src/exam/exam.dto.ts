import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  //   IsString,
} from 'class-validator';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

export class ExamScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  termId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  courseId: number;

  @IsOptional()
  room: string;

  @IsArray()
  schedule: ScheduleDto[];
}

export class ExamScheduleUpdateDto extends ExamScheduleDto {
  @IsArray()
  schedule: ScheduleUpdateDto[];
}
