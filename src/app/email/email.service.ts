import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Marketplace Integrator" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`E-mail enviado para ${to}: `, info.messageId);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para ${to}: `, error);
    }
  }
}
