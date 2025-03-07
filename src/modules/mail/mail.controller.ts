import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OnlyMaxRole } from 'src/constants';

@ApiTags('邮件')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({ summary: '发送邮件' })
  @OnlyMaxRole()
  @ApiResponse({ status: 200, description: '邮件发送成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '邮件发送失败' })
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }
}
