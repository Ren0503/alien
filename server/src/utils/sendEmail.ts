import nodemailer from 'nodemailer';

export default async ({ to, html }: { to: string; html: string }) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();
    console.log('testAccount = ', testAccount);

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"ALien forum 👻" <alien@example.com>', // sender address
        to,
        subject: 'Change Password', // Subject line
        html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
