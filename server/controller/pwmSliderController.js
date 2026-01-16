
let currSlider = 0;
let automode = false;
export function setpwmSlider(duty){
    currSlider = duty;
  console.log("⚡ PWM SET TO:", duty);
}

export function getpwmSlider(){
    return currSlider;
}


export function setAutomode(val){
automode = val;
 console.log("AUTO MODE:", automode);

}

export function isAutomode(){
    return automode;
}