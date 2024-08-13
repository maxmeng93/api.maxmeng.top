import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  @MinLength(5)
  readonly username: string;

  @ApiProperty({ description: '昵称', required: false })
  @IsString()
  @IsOptional()
  readonly nickname?: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  readonly email: string;
}

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['username']) {}
