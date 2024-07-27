import { Injectable } from '@nestjs/common';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

@Injectable()
export class MailService {
  private client: any;
  private domainName = 'oac@trial-0r83ql3vjqxgzw1j.mlsender.net';
  private fromName = 'OAC App';
  constructor() {
    this.client = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });
  }

  buildRecipients(recipients: { email: string; name: string }[]): Recipient[] {
    return recipients.map(
      (recipient) => new Recipient(recipient.email, recipient.name),
    );
  }

  sendEmail(
    subject: string,
    recipients: { email: string; name: string }[],
    text: string,
  ): Promise<any> {
    const builtRecipients = this.buildRecipients(recipients);
    console.log(builtRecipients);
    const sender = new Sender(this.domainName, this.fromName);
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(builtRecipients)
      .setSubject(subject)
      .setText(text);

    return this.client.email.send(emailParams);
  }
}
