<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>CodexAuth Secret Recovery</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; width: 100%; background-color: #3085f3; }
    </style>
</head>
<body style="background-color: #3085f3; background-image: linear-gradient(135deg, #3085f3 0%, #7d52e5 100%); margin: 0; padding: 40px 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding: 0 10px;">
                            <div style="background-color: #1a1c2d; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); color: #ffffff; text-align: left;">

                                <!-- Header -->
                                <div style="background-color: #1a1c2d; padding: 40px 0 20px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 10px;">
                                        <span style="font-size: 32px;">🔐</span> CodexAuth
                                    </h1>
                                    <p style="margin: 5px 0 0; color: #a0a0ff; font-size: 14px; letter-spacing: 0.5px;">Secret Recovery Portal</p>
                                </div>

                                <!-- Body -->
                                <div style="padding: 20px 40px 40px;">
                                    <p style="color: #ced4da; font-size: 16px; margin: 0 0 20px;">Hello,</p>
                                    <p style="color: #ced4da; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                        You requested to reset your secret. Use the token below to complete the reset process:
                                    </p>

                                    <!-- Token Box -->
                                    <div style="background: rgba(48, 133, 243, 0.1); border: 1px solid #3085f3; border-radius: 8px; padding: 25px 20px; text-align: center; margin-bottom: 30px;">
                                        <div style="color: #8890a0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Your Reset Token</div>
                                        <div style="color: #00d9ff; font-family: 'Courier New', monospace; font-size: 22px; font-weight: bold; word-break: break-all; line-height: 1.4; text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);">
                                            {{ $token }}
                                        </div>
                                        <div style="margin-top: 15px; color: #ff8e8e; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 5px;">
                                            <span>⏰</span> Expires: {{ now()->addMinutes(60)->format('M d, Y H:i:s') }}
                                        </div>
                                    </div>

                                    <!-- Button -->
                                    @if(isset($email))
                                    <div style="text-align: center;">
                                        <a href="http://localhost:3010/reset-password?token={{ $token }}&email={{ urlencode($email) }}"
                                           style="display: inline-block; background-image: linear-gradient(to right, #3085f3, #7d52e5); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(48, 133, 243, 0.4);">
                                           Enter Reset Token
                                        </a>
                                    </div>
                                    @endif
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
