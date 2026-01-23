import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'





export const encryptedPhone = (phone)=>{
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv("aes-256-cbc",
        Buffer.from(process.env.SECRET_KEY),
        iv
    );

    let encrypted = cipher.update(phone , 'utf8' , 'hex');

    encrypted += cipher.final('hex')

    return {
        phone:encrypted,
        iv:iv.toString('hex')
    }
}



export const decryptPhone = (phone , iv)=>{
    const decipher = crypto.createDecipheriv("aes-256-cbc" , Buffer.from(process.env.SECRET_KEY),Buffer.from(iv , 'hex')
);


let decrypted = decipher.update(phone , 'hex' , 'utf8');
decrypted += decipher.final('utf8')

return decrypted
}


export const  hashphone = (phone)=>{
    return crypto
    .createHash('sha256')
    .update(phone + process.env.SECRET_KEY)
    .digest('hex')
}



