import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

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

      // 处理邮件发送结果
      await this.handleMailResult(result);

      return result;
    } catch (error) {
      throw new BadRequestException('邮件发送失败', error);
    }
  }

  /**
   * 处理邮件发送结果
   * @param result 邮件发送结果
   */
  private async handleMailResult(result: SentMessageInfo): Promise<void> {
    if (!result || !result.accepted || !result.rejected) {
      return;
    }

    // 处理成功发送的邮件
    if (result.accepted.length > 0) {
      for (const email of result.accepted) {
        await this.prisma.user.updateMany({
          where: { email, emailFailCount: { not: 0 } },
          data: { emailFailCount: 0 },
        });
      }
    }

    // 处理发送失败的邮件
    if (result.rejected.length > 0) {
      for (const email of result.rejected) {
        await this.prisma.user.updateMany({
          where: { email },
          data: {
            emailFailCount: {
              increment: 1,
            },
          },
        });
      }
    }
  }
}
