import UserModel from "../models/user.model.js";

export const  getuserdata= async(req,res)=>{
        try {
            
              const UserId = req.UserId;
          
            const user = await UserModel.findById(UserId)
            if(!user) return res.json({success:false,message:"user not found"})

                res.json({success:true,
                    userData:{
                        name:user.name,
                        isAccountVerified:user.isAccountVerified,
                    }
                })

        } catch (error) {
            res.json({success:false , message:error.message})
        }
}
