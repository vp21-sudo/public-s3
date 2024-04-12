
interface params{
  link:string,
  userName:string
}

const verifyEmailTemplate = ({link, userName}: params) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body>
      <table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <tr>
          <td style="text-align: center;">
            <h2>Email Verification</h2>
          </td>
        </tr>
        <tr>
          <td>
            <p>Dear ${userName},</p>
            <p>Thank you for registering with our service. To complete your registration, please click the button below to verify your email address:</p>
            <p><a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If you didn't request this, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <p>Thank you,</p>
            <p>The Uplaod Team</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    
    `
}

export {
  verifyEmailTemplate
}