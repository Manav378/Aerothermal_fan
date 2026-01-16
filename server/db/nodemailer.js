import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

console.log("📌 SMTP_USER:", process.env.SMTP_USER);
console.log("📌 SMTP_PASS:", process.env.SMTP_PASS ? "LOADED ✓" : "NOT LOADED");

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});



transporter.verify((err, success) => {
  if (err) console.log("❌ SMTP ERROR:", err.message);
  else console.log("✅ SMTP Connected Successfully");
});

export default transporter