import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * 发送邮件到多个收件人
   * @param sendMailDto 邮件发送数据传输对象
   * @returns 发送结果
   */
  async sendMail(sendMailDto: SendMailDto): Promise<SentMessageInfo> {
    const { to, subject, text, html, cc, bcc, attachments } = sendMailDto;

    try {
      const result: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        attachments,
      });

      return result;
    } catch (error) {
      throw new BadRequestException('邮件发送失败', error);
    }
  }
}
