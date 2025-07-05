import { createTransport } from "nodemailer";
const BACKEND_ROUTE = process.env.BACKEND_ROUTE;
const welcomEmail = ({ otp, to, subject }) => {
  return `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
  </head>
  <body class="body">
    <div dir="ltr" class="es-wrapper-color">
      <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#fafafa"></v:fill>
			</v:background>
		<![endif]-->
      <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper">
        <tbody>
          <tr>
            <td valign="top" class="esd-email-paddings">
              <table cellpadding="0" cellspacing="0" align="center" class="es-header">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe esd-synchronizable-module">
                      <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" width="600" class="es-header-body">
                        <tbody>
                          <tr>
                            <td align="left" class="esd-structure es-p10t es-p10b es-p20r es-p20l">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="560" valign="top" align="center" class="es-m-p0r esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td align="center" class="esd-block-image es-p20b" style="font-size:0px">
                                              <a target="_blank">
                                                <img src="https://eohqeqz.stripocdn.email/content/guids/CABINET_f2655ba4674857c4e489cea150eafcd790b3ba2af48e02f9f0816161fb974dd4/images/logo232.png" alt="AJL Webcraft logo" width="500" title="AJL Webcraft logo" class="adapt-img" style="display: block; font-size: 12px">
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" align="center" class="es-content">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe">
                      <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" width="600" class="es-content-body">
                        <tbody>
                          <tr>
                            <td align="left" class="esd-structure es-p30t es-p20b es-p20r es-p20l">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="560" align="center" valign="top" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td align="left" class="esd-block-text es-p10b">
                                              <h1 class="es-m-txt-l" style="font-size:46px;line-height:100%">
                                                <b>${subject}</b>
                                              </h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" class="esd-block-text es-p5t es-p5b">
                                              <p>
                                                Hi, ${to}!
                                              </p>
                                              <p>
                                                You have requested an OTP from ajlwebcraft.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" class="esd-block-text es-p5t es-p5b">
                                              <p>
                                                Best regards,<br>AJL Webcraft.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-image es-p10t es-p10b" style="font-size:0px">
                                              <a target="_blank">
                                                <img src="https://eohqeqz.stripocdn.email/content/guids/CABINET_1232eee4cab038122cd07270cd3bb85f/images/70451618316407074.png" alt="" width="260" class="adapt-img" style="display:block">
                                              </a>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" height="48" valign="middle" class="esd-block-button es-p10t es-p10b h-auto">
                                              <span class="es-button-border" style="border-width: 1px; border-color: #5c68e2; background: #5c68e2; padding: 15px 30px; border-radius: 8px">
                                                <a href='${BACKEND_ROUTE}/auth/reset-password?token=${otp}&email=${to}' target="_blank" class="es-button" style="color: #fff; text-decoration: none; font-weight: 700">
                                                  CLICK TO JOIN US
                                                </a>
                                              </span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" align="center" class="es-footer">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe esd-synchronizable-module">
                      <table align="center" cellpadding="0" cellspacing="0" width="640" class="es-footer-body" style="background-color:transparent">
                        <tbody>
                          <tr>
                            <td align="left" class="esd-structure es-p20t es-p20b es-p20r es-p20l">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="600" align="left" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td align="center" class="esd-block-social es-p15t es-p15b" style="font-size: 0">
                                              <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" valign="top" class="es-p40r">
                                                      <a target="_blank" href="">
                                                        <img title="Facebook" src="https://eohqeqz.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32">
                                                      </a>
                                                    </td>
                                                    <td align="center" valign="top" class="es-p40r">
                                                      <a target="_blank" href="">
                                                        <img title="X" src="https://eohqeqz.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" width="32">
                                                      </a>
                                                    </td>
                                                    <td align="center" valign="top" class="es-p40r">
                                                      <a target="_blank" href="">
                                                        <img title="Instagram" src="https://eohqeqz.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32">
                                                      </a>
                                                    </td>
                                                    <td align="center" valign="top">
                                                      <a target="_blank" href="">
                                                        <img title="Youtube" src="https://eohqeqz.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p35b">
                                              <p>
                                                AJL Webcraft © 2025 Style Casual, Inc. All Rights Reserved.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td esd-tmp-menu-padding="5|5" esd-tmp-divider="1|solid|#cccccc" esd-tmp-menu-color="#999999" class="esd-block-menu">
                                              <table cellpadding="0" cellspacing="0" width="100%" class="es-menu">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l esd-block-menu-item" style="padding-top:5px;padding-bottom:5px">
                                                      <div>
                                                        <a target="_blank" href="https://" style="color:#999999">
                                                          Visit Us
                                                        </a>
                                                      </div>
                                                    </td>
                                                    <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l esd-block-menu-item" style="padding-top:5px;padding-bottom:5px;border-left:1px solid #cccccc">
                                                      <div>
                                                        <a target="_blank" href="https://" style="color:#999999">
                                                          Privacy Policy
                                                        </a>
                                                      </div>
                                                    </td>
                                                    <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l esd-block-menu-item" style="padding-top:5px;padding-bottom:5px;border-left:1px solid #cccccc">
                                                      <div>
                                                        <a target="_blank" href="https://" style="color:#999999">
                                                          Terms of Use
                                                        </a>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" align="center" class="es-content esd-footer-popover">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe esd-synchronizable-module">
                      <table align="center" cellpadding="0" cellspacing="0" width="600" bgcolor="rgba(0, 0, 0, 0)" class="es-content-body" style="background-color:transparent">
                        <tbody>
                          <tr>
                            <td align="left" class="esd-structure es-p20">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="560" align="center" valign="top" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td align="center" class="esd-block-text es-infoblock">
                                              <p>
                                                <a target="_blank"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank">Unsubscribe</a>.<a target="_blank"></a>
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;
};
export const sendOtpMail = async ({ to, subject, otp }) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "kennyegun240@gmail.com",
      pass: "nzvk zrti dxxu eonz",
    },
  });

  var mailOptions = {
    from: "kennyegun240@gmail.com",
    to: to,
    subject: subject,
    // text: "That was easy!",
    html: welcomEmail({ otp, to, subject }),
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
