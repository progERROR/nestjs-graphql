import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class SignResponse {
  @ApiProperty()
  public user: UserResponse;

  @ApiProperty()
  public accessToken: string;
}
