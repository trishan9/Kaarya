import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

import { Prisma } from "@prisma/client";
import config from "@/config";

export interface MailOptions {
  to: string;
  subject: string;
  user: Prisma.UserCreateInput;
}

export async function sendOnboardingMail(user: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  const subject = "Welcome to Kaarya - Your Account Details Inside";

  try {
    const templatePath = path.join(__dirname, "templates", "index.html");
    const template = fs.readFileSync(templatePath, "utf-8");
    const customizedTemplate = template
      .replace("{{name}}", user.name)
      .replace("{{email}}", user.email)
      .replace("{{password}}", user.password);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmail.emailAddress,
        pass: config.gmail.password,
      },
    });

    const mailOptions = {
      from: config.gmail.emailAddress,
      to: user.email,
      subject,
      html: customizedTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
