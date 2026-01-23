export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0F172A;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:40px 0;">
  <tr>
    <td align="center">

      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background:linear-gradient(90deg,#0284C7,#0EA5E9);padding:20px;color:#ffffff;font-size:20px;font-weight:bold;">
            🌬️ Aerothermal Fan
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:30px;color:#1E293B;font-size:14px;line-height:1.6;">
            <h3 style="margin-top:0;">Email Verification</h3>

            <p>
              You’re almost there! Verify your account associated with  
              <strong>{{email}}</strong>.
            </p>

            <p>Use the OTP below to complete verification:</p>

            <div style="
              background:#F1F5F9;
              padding:14px;
              text-align:center;
              font-size:22px;
              letter-spacing:4px;
              font-weight:bold;
              color:#0284C7;
              border-radius:6px;
              margin:20px 0;
            ">
              {{otp}}
            </div>

            <p>This OTP is valid for <strong>24 hours</strong>.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background:#F8FAFC;padding:14px;font-size:12px;color:#64748B;">
            © 2026 Aerothermal Fan • Smart IoT Cooling Solutions
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
