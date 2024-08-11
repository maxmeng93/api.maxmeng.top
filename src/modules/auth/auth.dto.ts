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

export class RequestPasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '邮箱' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'token' })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '密码' })
  newPassword: string;
}
