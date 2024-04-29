import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

export class TimetableDto {
  userId: number;

  termId: number;

  courseId: number;

  repeat: boolean;

  schedule: ScheduleDto[];
}

export class TimetableCreateDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  termId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  courseId: number;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  repeat: boolean;

  @IsArray()
  schedule: ScheduleDto[];
}

export class TimetableUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  termId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  courseId: number;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  repeat: boolean;

  @IsArray()
  schedule: ScheduleUpdateDto[];
}
