import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  //   IsString,
} from 'class-validator';
import { ScheduleDto } from 'src/schedule/schedule.dto';

export class ClassScheduleDto {
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

  @IsOptional()
  building: string;

  @IsOptional()
  lecturer: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  repeat: boolean;

  @IsArray()
  schedule: ScheduleDto[];

  //   @IsString()
  //   @IsNotEmpty()
  //   days: string;
}
