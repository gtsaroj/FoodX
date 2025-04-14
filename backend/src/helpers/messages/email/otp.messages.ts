export const OTPEMAIL = (otp: string) => `
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #dddddd;">
              <h2 style="margin: 0; color: #333333; font-size: 24px;">Your One-Time Password (OTP)</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="font-size: 16px; color: #555555; margin: 0 0 20px;">
                Use the OTP below to complete your verification process. This code is valid for the next 5 minutes.
              </p>
              <div style="display: inline-block; padding: 15px 30px; font-size: 24px; background-color: #007BFF; color: #ffffff; border-radius: 6px; font-weight: bold; letter-spacing: 3px;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #999999; margin-top: 30px;">
                If you did not request this code, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="font-size: 12px; color: #aaaaaa;">
                &copy; 2025 FOODX. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;
