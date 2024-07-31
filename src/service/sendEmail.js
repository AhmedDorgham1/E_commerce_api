import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ahmeddorgham779@gmail.com",
      pass: "kyxaqxujpdxryxnx",
    },
  });

  const info = await transporter.sendMail({
    from: '"☝️☝️" <ahmeddorgham779@gmail.com>',
    to: to ? to : "ahmeddorgham779@gmail.com",
    subject: subject ? subject : "Hello ✔",
    html: html ? html : "Hello world?",
  });

  if (info.accepted.length) {
    return true;
  }
  return false;
};
