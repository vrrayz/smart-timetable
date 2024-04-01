import { IsNotEmpty, MaxLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @MaxLength(100)
  @IsNotEmpty()
  name: string;
}
