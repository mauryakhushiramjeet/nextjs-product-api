import { mailMessages } from "./emailServices";

export default async function resetPasswordMail(to:string, otp:string) {
  const subject = "Reset Your Password"; 

  const html = `
  <div style="max-width:600px;margin:50px auto;background-color:#fff;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);border-top:6px solid #4a90e2;font-family:Arial,sans-serif;">
    
    <h1 style="color:#333333;font-size:26px;text-align:center;margin-bottom:10px;">
      Reset Your Password
    </h1>

    <p style="font-size:16px;color:#555555;line-height:1.6;">
      Hi,
    </p>

    <p style="font-size:16px;color:#555555;line-height:1.6;">
      We received a request to reset your password. Use the following 
      <span style="color:#4a90e2;font-weight:600;">OTP</span> to reset your password:
    </p>

    <div style="display:block;width:fit-content;margin:20px auto;font-size:28px;font-weight:bold;background-color:#eaf1fc;color:#4a90e2;padding:15px 25px;border-radius:8px;text-align:center;letter-spacing:6px;">
      ${otp}
    </div>

    <p style="font-size:16px;color:#555555;line-height:1.6;text-align:center;">
      This OTP is valid for 
      <span style="color:#4a90e2;font-weight:600;">5 minutes</span>. Do not share it with anyone.
    </p>

    <p style="font-size:14px;color:#999999;text-align:center;margin-top:30px;">
      If you did not request a password reset, please ignore this email or contact support.
    </p>

    <p style="font-size:14px;color:#999999;text-align:center;margin-top:10px;">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </p>

  </div>
  `;

  await mailMessages(to, html, subject);
}