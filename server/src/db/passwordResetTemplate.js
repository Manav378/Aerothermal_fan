export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>Aerothermal Fan | Password Reset</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0F172A;
      font-family: 'Inter', sans-serif;
    }
    .container {
      max-width: 520px;
      margin: 60px auto;
      background: #FFFFFF;
      border-radius: 10px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #F97316, #FB923C);
      padding: 20px;
      color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
    .content {
      padding: 32px;
      color: #1E293B;
      font-size: 14px;
      line-height: 1.6;
    }
    .otp {
      margin: 20px 0;
      padding: 14px;
      background: #FFF7ED;
      border-radius: 6px;
      text-align: center;
      font-size: 22px;
      letter-spacing: 4px;
      font-weight: 600;
      color: #F97316;
    }
    .footer {
      padding: 16px;
      background: #F8FAFC;
      font-size: 12px;
      color: #64748B;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      🔐 Aerothermal Fan
    </div>

    <div class="content">
      <h3>Password Reset Request</h3>
      <p>
        A password reset was requested for  
        <strong>{{email}}</strong>.
      </p>

      <p>Use the OTP below to reset your password:</p>

      <div class="otp">{{otp}}</div>

      <p>This OTP is valid for <strong>15 minutes</strong>.</p>
    </div>

    <div class="footer">
      If this wasn’t you, please ignore this email.
    </div>
  </div>
</body>
</html>
`
