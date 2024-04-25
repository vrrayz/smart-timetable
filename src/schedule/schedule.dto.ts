import { Type } from 'class-transformer';
import {
  IsDate,
  //   IsBoolean,
  IsNotEmpty,
  //   IsOptional,
  IsString,
} from 'class-validator';

export class ScheduleDto {
  //   @IsNotEmpty()
  //   @Type(() => Number)
  //   termId: number;

  //   @IsNumber()
  //   @IsNotEmpty()
  //   @Type(() => Number)
  //   courseId: number;

  //   @IsOptional()
  //   room: string;

  //   @IsOptional()
  //   building: string;

  //   @IsOptional()
  //   lecturer: string;

  //   @IsNotEmpty()
  //   @IsBoolean()
  //   @Type(() => Boolean)
  //   repeat: boolean;
  @IsString()
  @IsNotEmpty()
  days: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
