import type {
  IMailProvider,
  ISendMailParams,
} from '@domain/providers/mail.provider.ts'
import { env } from '@shared/env.ts'
import { createTransport } from 'nodemailer'

export class NodemailerMailProvider implements IMailProvider {
  private readonly transporter = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })

  async sendMail({ to, subject, body }: ISendMailParams): Promise<void> {
    await this.transporter.sendMail({
      from: env.SMTP_USER,
      to,
      subject,
      html: body,
    })
  }
}
