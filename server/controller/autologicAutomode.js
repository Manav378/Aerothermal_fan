export function Calculatepwm(temp) {
  if (temp > 60) return 0; // emergency
  if (temp > 45) return 255;
  if (temp > 40) return 200;
  if (temp > 35) return 150;
  if (temp > 30) return 100;
  return 60;
}
