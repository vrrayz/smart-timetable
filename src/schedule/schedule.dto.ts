import { Type } from 'class-transformer';
import {
  IsDate,
  //   IsBoolean,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  startTime: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  endTime: number;
}

export class ScheduleUpdateDto extends ScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
