import mongoose from 'mongoose'


const DeviceSchema = new mongoose.Schema({
    deviceName:{type:String , required:true,unique:true},
    devicePass_Key:{type:String , required:true , unique:true},
    isOnline:{type:Boolean , default:false},
    lastSeen:{type:Date},
    temperature:Number,
    rpm:Number,
    pwm:Number,
})


 const DeviceModels = mongoose.model("Device", DeviceSchema)
 export default DeviceModels