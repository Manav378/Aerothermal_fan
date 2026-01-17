


import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(twilioSid, authToken);

export const sendTempAlertSms = async (phone, temperature) => {
  try {

      phone = phone.toString().startsWith("+") ? phone : `+91${phone}`;

    const res = await client.messages.create({
      body: `⚠️ ALERT: The device temperature has exceeded the safe limit (${temperature}°C).`,
      from: twilioPhone,
      to: phone,
    });

    console.log("SMS sent:", res.sid);
  } catch (error) {
    console.error("SMS error:", error.message);
  }
};
