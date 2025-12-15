import nodemailer from "nodemailer";
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_PORT = process.env.EMAIL_PORT;

console.log(EMAIL_PASSWORD, EMAIL_PORT, EMAIL_SERVICE, EMAIL_USER);
const transporter = nodemailer.createTransport({
  host: EMAIL_SERVICE,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:");
    console.error(error);
  } else {
    console.log("SMTP Server is ready to take messages");
  }
});

export const mailMessages = async (to, html, subject) => {
  const info = await transporter.sendMail({
    from: EMAIL_USER,
    to: to,
    subject: subject,
    // text: "Hello world?", // plain‑text body
    html: html,
  });
  console.log("Message sent:", info.messageId);
  console.log("system reached at verifyOtp function");
};




