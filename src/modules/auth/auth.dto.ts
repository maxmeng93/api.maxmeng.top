import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '密码' })
  readonly password: string;
}
