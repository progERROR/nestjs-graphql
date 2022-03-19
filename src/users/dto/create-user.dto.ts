import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty()
  public userName: string;

  @ApiProperty({
    required: true,
    example: 'email@email.com',
  })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Email must be a type of email',
  })
  public email: string;

  @ApiProperty({
    required: true,
    example: 'Qwerty_1234',
  })
  @MinLength(6)
  @MaxLength(64)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak, please create a stronger password!',
  })
  public password: string;
}
