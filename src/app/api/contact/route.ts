import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, phone } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Configure Nodemailer with Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(process.env.SMTP_PORT) || 465, // or 587
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email Content
    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`, // Sends from verified Hostinger email but sets name
        replyTo: email, // Valid for replying to the user
        to: 'support@nmarkfire.com',
        subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone || 'Not provided'}
          Subject: ${subject || 'N/A'}

          Message:
          ${message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #dc2626;">New Contact from NMarkFire Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <br>
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #dc2626; white-space: pre-wrap;">${message}</div>
          </div>
        `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
