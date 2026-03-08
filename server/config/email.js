const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send email verification link to user
 */
const sendVerificationEmail = async (user, token) => {
    const transporter = createTransporter();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify-email/${token}`;

    const mailOptions = {
        from: `"Aradhya Gems" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Verify Your Email — Aradhya Gems',
        html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #8B6914; font-size: 28px; margin: 0;">Aradhya Gems</h1>
          <p style="color: #666; font-size: 14px; margin-top: 4px;">Exquisite Jewelry, Timeless Elegance</p>
        </div>
        
        <div style="background: #f9f7f4; border-radius: 12px; padding: 32px; text-align: center;">
          <h2 style="color: #1a1a1a; font-size: 22px; margin-bottom: 16px;">Welcome, ${user.firstName}!</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for creating an account with Aradhya Gems. 
            Please verify your email address to get started on your jewelry journey.
          </p>
          
          <a href="${verifyUrl}" 
             style="display: inline-block; background: #8B6914; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
            Verify Email Address
          </a>
          
          <p style="color: #888; font-size: 13px; margin-top: 24px;">
            This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #999; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Aradhya Gems. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, token) => {
    const transporter = createTransporter();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    const mailOptions = {
        from: `"Aradhya Gems" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Reset Your Password — Aradhya Gems',
        html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #8B6914; font-size: 28px; margin: 0;">Aradhya Gems</h1>
        </div>
        
        <div style="background: #f9f7f4; border-radius: 12px; padding: 32px; text-align: center;">
          <h2 style="color: #1a1a1a; font-size: 22px; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          
          <a href="${resetUrl}" 
             style="display: inline-block; background: #8B6914; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Reset Password
          </a>
          
          <p style="color: #888; font-size: 13px; margin-top: 24px;">
            This link expires in 1 hour. If you didn't request this, ignore this email.
          </p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
