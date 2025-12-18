import nodemailer from 'nodemailer';

export default async function sendMail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT);
  const mail = process.env.SMTP_MAIL;

  if (!host || !user || !pass || !port || !mail) {
    throw new Error('SMTP configuration is incomplete');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"SEED" <${mail}>`,
    to,
    subject,
    html: content,
  });
}
