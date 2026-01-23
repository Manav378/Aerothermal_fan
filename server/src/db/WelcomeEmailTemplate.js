export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Aerothermal Fan</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0B1220;
      font-family: 'Inter', sans-serif;
    }
    .container {
      max-width: 520px;
      margin: 60px auto;
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
    }
    .header {
      background: linear-gradient(90deg, #0284C7, #0EA5E9);
      padding: 26px;
      color: #fff;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px;
      color: #1E293B;
      font-size: 14px;
      line-height: 1.7;
    }
    .highlight {
      background: #EFF6FF;
      border-left: 4px solid #0284C7;
      padding: 14px;
      margin: 22px 0;
      border-radius: 6px;
      color: #0F172A;
    }
    .footer {
      padding: 16px;
      background: #F1F5F9;
      font-size: 12px;
      color: #64748B;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      🌬️ Welcome to Aerothermal Fan
    </div>

    <div class="content">
      <h3>Hello {{name}} 👋</h3>

      <p>
        Welcome aboard! Your account has been successfully created with  
        <strong>Aerothermal Fan</strong>.
      </p>

      <p>
        Your account has been created with email:  
        <strong>{{email}}</strong>
      </p>

      <div class="highlight">
        You can now monitor temperature, control fan speed (PWM), enable auto-mode,
        and manage your smart aerothermal devices in real time.
      </div>

      <p>
        You can now log in and start using the system.
      </p>
    </div>

    <div class="footer">
      © 2026 Aerothermal Fan • Smart IoT Cooling Solutions<br/>
      Need help? Contact our support anytime.
    </div>
  </div>
</body>
</html>
`
