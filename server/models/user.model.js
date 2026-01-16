import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    verifyotp:{
        type:String,
        default:''
    },
    verifyotpExprieAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetotp:{
        type:String,
        default:''
    },
    resetoptExpireAt:{
        type:Number,
        default:0
    },

    devices:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"devices"
        }
    ]
},{timestamps:true})

const UserModel = mongoose.models.user|| mongoose.model("user" , userSchema);

export default UserModel