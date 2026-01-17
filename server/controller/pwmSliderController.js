let currPWM = 80;        // PWM_MIN (IMPORTANT)
let autoMode = false;

export function setPWM(val) {
  currPWM = val;
  console.log("⚡ MANUAL PWM SET:", currPWM);
}

export function getPWM() {
  return currPWM;
}

export function setAutoMode(val) {
  autoMode = val;
  console.log("🤖 AUTO MODE:", autoMode);
}

export function isAutoMode() {
  return autoMode;
}
