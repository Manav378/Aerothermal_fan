import UserModel from "../models/user.model.js";

export const getLanguage = async(req,res)=>{
  try {
    const userid = req.UserId;
    console.log(userid)
    if(!userid) return res.status(404).json({success:false , message:"userid not found!"})

    const user = await UserModel.findById(userid).select("languages");
    if(!user) return res.status(404).json({success:false , message:"user not found!"})

    res.status(200).json({success:true , message:user.languages})
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false , message:error.message})
  }
}


export const updateLanguage  = async(req , res)=>{
    try {
        const {languages} = req.body;
        const userid = req.UserId;
          if(!userid) return res.status(404).json({success:false , message:"userid not found!"})
        if(!['en' , 'hi'].includes(languages)) return res.status(400).json({suceess:false , message:"Invalid language"})

            await UserModel.findByIdAndUpdate(userid , {languages})

            res.status(200).json({success:true , message:"Language changed successfully😄"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:error.message})
    }
}