const emailTemplate = ({ subject = '', project = '', tutar = '' }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>${subject}</title>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="IE=edge" http-equiv="X-UA-Compatible"><meta content="width=device-width, initial-scale=1" name="viewport"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta content="yes" name="apple-mobile-web-app-capable"><meta content="black" name="apple-mobile-web-app-status-bar-style"><meta content="telephone=no" name="format-detection">
  <style type="text/css">
    #outlook a {padding:0;}
    body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
    .ExternalClass {width:100%;}
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
    img {outline:none; text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}
    a img {border:none;text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}
    a { color:#616161; text-decoration:none }
    p { padding:0 !important; margin:0 !important }
    .text-footer-2 a { color: #b1b1b1; text-decoration: none; }
    @media only screen and (max-width: 700px) {
      table.container{ width:100% !important; }
      .gizle{ display:none !important; }
      img.resim { width:100% !important; height:auto !important; }
      div.container{ width:100% !important; }
      *[class*="onlymobile"] { display: block !important; max-height: none !important; }
      #logo {height:28px !important; margin-top:3px;}
      .main-table, .main-content img { width:100% !important;}
    }
    @media screen and (min-width: 500px) {
      img.buyut { width:100% !important; height:auto !important; }
      div.genislet { width:95% !important; }
    }
  </style>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" marginheight="0" marginwidth="0" topmargin="0">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
  <tbody>
    <tr>
      <td align="center">
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="container" width="700">
        <tbody>
          <tr>
            <td align="center" height="77"><a href="https://arileasing.com.tr/" target="_blank"><img alt="Lütfen Resimleri Görüntüleyiniz" height="139" src="https://arileasing.com.tr/statics/images/menu/logo.png" style="border-width: 0px; border-style: solid;" width="500" /></a></td>
          </tr>
          <tr>
            <td bgcolor="white" height="15"></td>
          </tr>
          <tr>
            <td align="center" class="ortala" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; text-align:left; padding:5px;"><span style="font-size:16px;">Değerli müşterimiz,</span><br />&nbsp;</td>
          </tr>
          <tr>
            <td align="center" class="ortala" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; text-align:left; padding:5px;">{{project}} projesinde bulunan sözleşmelerinizin {{tutar}} TL ödenmemiş taksiti bulunmaktadır. Bugün ödenmesi hususunda gereğini rica ederiz. Ödemelerinizi online sistemden kontrol edip ödeme yapabilirsiniz.<br />
            <br />
            ÖDEME YAPILDIYSA MESAJI DİKKATE ALMAYINIZ.<br />
            <br />
            Arı Finansal Kiralama</td>
          </tr>
          <tr>
            <td align="center" class="ortala" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; text-align:left; padding:5px;"></td>
          </tr>
          <tr>
            <td bgcolor="white" height="25"></td>
          </tr>
          <tr>
            <td align="center" bgcolor="#980748" color="#ffffff" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#454545; padding:10px;" width="100%"><span style="color:#ffffff;">Sultantepe Mahallesi Hüseyin Baykara Sokak No:1/3 34674 Üsküdar / İSTANBUL Tel: 444 76 80 E-mail:&nbsp;rig@arileasing.com.tr<br />
            Mersis No: 0147005285500018</span></td>
          </tr>
        </tbody>
      </table>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
`;

export default emailTemplate;
