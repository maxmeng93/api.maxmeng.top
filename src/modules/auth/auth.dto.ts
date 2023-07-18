import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  readonly password: string;
}
