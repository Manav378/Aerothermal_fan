import mongoose from 'mongoose'


const DeviceSchema = new mongoose.Schema({
    deviceName:{type:String , required:true,unique:true},
    devicePass_Key:{type:String , required:true , unique:true},
    lastSeen:{type:Date},
    temperature:Number,
    rpm:Number,
    pwm:Number,
    pwmValue:{type:Number , default:126},
    autoMode:{type:Boolean , default:false},
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
   isVerified: { type: Boolean, default: false },
   isActive: {
  type: Boolean,
  default: false
}

})


 const DeviceModels = mongoose.model("Device", DeviceSchema)
 export default DeviceModels