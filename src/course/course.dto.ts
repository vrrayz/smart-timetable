import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CourseDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  termId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;
}
