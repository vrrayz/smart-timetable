import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleDto, ScheduleUpdateDto } from 'src/schedule/schedule.dto';

export class TaskScheduleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsArray()
  schedule: ScheduleDto[];
}

export class TaskScheduleUpdateDto extends TaskScheduleDto {
  @IsArray()
  schedule: ScheduleUpdateDto[];
}
