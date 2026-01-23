import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../db/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../db/emailTemplates.js";
import { PASSWORD_RESET_TEMPLATE } from "../db/passwordResetTemplate.js";
import { WELCOME_EMAIL_TEMPLATE } from "../db/WelcomeEmailTemplate.js";
import { encryptedPhone, hashphone } from "../utils/crypto.js";
// ✅ Cross-site cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res
      .status(404)
      .json({ message: "The user is not created", success: false });

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const phoneHash = hashphone(phone);
    const phoneExist = await UserModel.findOne({ phoneHash });
    if (phoneExist)
      return res.json({ success: false, message: "phone already exist" });

    const hashedCryptoPhone = encryptedPhone(phone);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      phone: hashedCryptoPhone.phone,
      iv: hashedCryptoPhone.iv,
      phoneHash: phoneHash,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);

    await transporter.sendMail({
      from: `"Aerothermal Fan Team 🌬️" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Welcome to Aerothermal Fan",
      html: WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name || "User").replace(
        "{{email}}",
        email,
      ),
      
    });

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Email and password required" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- AUTH CHECK --------------------
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- SEND VERIFY OTP --------------------
export const sendverifyotp = async (req, res) => {
  try {
    const user = await UserModel.findById(req.UserId); // ✅ JWT based
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.isAccountVerified)
      return res.json({ success: false, message: "Account already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExprieAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

   await transporter.sendMail({
  from: `"Aerothermal Fan Team 🌬️" <${process.env.SENDER_EMAIL}>`,
  to: user.email,
  subject: "Aerothermal Fan | Account Verification OTP",
  html: EMAIL_VERIFY_TEMPLATE
    .replace("{{otp}}", otp)
    .replace("{{email}}", user.email),

});

    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- VERIFY EMAIL --------------------
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.json({ success: false, message: "OTP is required" });

  try {
    const user = await UserModel.findById(req.UserId); // ✅ JWT based
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.verifyotp || user.verifyotp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.verifyotpExprieAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExprieAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- SET RESET OTP --------------------
export const setResetotp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not available" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

  await transporter.sendMail({
  from: `"Aerothermal Fan Team 🌬️" <${process.env.SENDER_EMAIL}>`,
  to: user.email,
  subject: "Aerothermal Fan | Password Reset OTP",
  html: PASSWORD_RESET_TEMPLATE
    .replace("{{otp}}", otp)
    .replace("{{email}}", user.email),
});


    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.resetotp || user.resetotp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetotpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetotp = "";
    user.resetotpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
