import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StudyPreferenceDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  startTime: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  endTime: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  coursesPerDay: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  breaksPerDay: number;
}
