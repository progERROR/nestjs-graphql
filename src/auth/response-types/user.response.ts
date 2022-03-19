import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../users/enums/roles.enum';

export class UserResponse {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public userName: string;

  @ApiProperty()
  public id: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
  })
  public Role: Role;
}
