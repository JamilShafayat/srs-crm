import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/common/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService
      .sendMail({
        to: 'code.xamil@gmail.com',
        from: 'user@outlook.com', // senders email address
        subject: 'Testing Nest MailerModule ✔', // subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
