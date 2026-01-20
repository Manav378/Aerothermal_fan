import React, { useContext } from "react";
import { assets } from "../temp/assets.js"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Appcontent } from "../context/Appcontext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const navigate = useNavigate();


  const {backendUrl} = useContext(Appcontent)
 axios.defaults.withCredentials = true;
    
  const [email, setemail] = useState('');
  const [newpassword, setnewpassword] = useState('');
   const [isemailsent, setisemailsent] = useState('');
   const [otp, setotp] = useState(0);
   const [summited, setsummited] = useState(false);

   const inputrefs = React.useRef([])
    const handelInput = (e,index)=>{
    if(e.target.value.length > 0 && index < inputrefs.current.length -1){
      inputrefs.current[index+1].focus()
    }

  }
const handelDelete = (e, index) => {
  if (e.key === "Backspace" && !e.target.value && index > 0) {
    inputrefs.current[index - 1].focus();
  }
};


  const handelPaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pastArray = paste.split('')
    pastArray.forEach((char , index)=>{
        if(inputrefs.current[index]){
          inputrefs.current[index].value = char
        }
    })
  }


const onsubmitEmail = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(backendUrl + "/api/auth/is-setreset", { email });

    console.log("API response:", res.data);

    res.data.success
      ? toast.success(res.data.message)
      : toast.error(res.data.message);

    res.data.success && setisemailsent(true);
  } catch (error) {
    toast.error(error.message);
  }
};



const onsumbimtedOTP = (e) => {
  e.preventDefault();
  const otpStr = inputrefs.current.map(e => e.value).join('');
  setotp(otpStr);   // update state
  setsummited(true);
};

const onSubmitNewPassword = async(e) => {
  e.preventDefault();
  try {
    if(!otp || !email || !newpassword) {
      return toast.error("Email, OTP, and new password are required");
    }
    const {data} = await axios.post(
      backendUrl + '/api/auth/is-resetpass',
      { email, otp, newPassword: newpassword }  // backend expects 'newPassword'
    );

    data.success ? toast.success(data.message) : toast.error(data.message)
    data.success && navigate('/login')
  } catch (error) {
    toast.error(error.message)
  }
}


  return (
    <div
      className=" flex items-center justify-center min-h-screen
     px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400  select-none"
    >
      <img
        src={assets.aero}
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />
     { /*enter your email */}
{!isemailsent && <form onSubmit={onsubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your register email address
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">

        <img src={assets.mail_icon} className="w-3 h-3" alt="" />
        
        <input type="email" value={email} onChange={(e)=>setemail(e.target.value)} required className="text-white bg-transparent outline-none" placeholder="Email id" />


        </div>
      <button className="w-full py-2.5 bg-linear-to-r cursor-pointer from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
      </form> }

      

      {/*otp input tag */}

    {!summited && isemailsent &&   <form onSubmit={onsumbimtedOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
            
            <div className='flex justify-center gap-[5px] mb-8' onPaste={handelPaste}> 
            {Array(6).fill(0).map((_,index)=>(
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-lg rounded-md' ref={e=>inputrefs.current[index] =e}
            onInput={(e)=> handelInput(e,index)}
            onKeyDown={(e) =>handelDelete(e,index)}
            />
            
            ))}
            </div>

            <button  className='w-full py-2.5 bg-linear-to-r rounded-full cursor-pointer from-indigo-500 to-indigo-900'>Submit</button>
           </form> }




           {/*Enter new password*/}
          {summited && isemailsent &&        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          New Passowrd
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the new password below
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">

        <img src={assets.lock_icon} className="w-3 h-3" alt="" />
        
        <input type="password" value={newpassword} onChange={(e)=>setnewpassword(e.target.value)} required className="text-white bg-transparent outline-none" placeholder="password" />


        </div>
      <button className="w-full py-2.5 bg-linear-to-r cursor-pointer from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
      </form>}
         
    </div>
  );
};

export default ResetPassword;