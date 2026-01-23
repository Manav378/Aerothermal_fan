import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    iv: { type: String, required: true },
    phoneHash:{type:String , required:true,unique:true},
    verifyotp: {
      type: String,
      default: "",
    },
    verifyotpExprieAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetotp: {
      type: String,
      default: "",
    },
    resetoptExpireAt: {
      type: Number,
      default: 0,
    },
    lastseen:{type:Date , default:null},

    languages:{
      type:String,
      enum:['en' , 'hi'],
      default:'en'
    },

    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel;
