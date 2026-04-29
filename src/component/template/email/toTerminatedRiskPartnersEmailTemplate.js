const toTerminatedRiskPartnersEmailTemplate = ({ subject = '', project = '', tutar = '' }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>%%konu%%</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="IE=edge" http-equiv="X-UA-Compatible"><meta content="width=device-width, initial-scale=1" name="viewport"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta content="yes" name="apple-mobile-web-app-capable"><meta content="black" name="apple-mobile-web-app-status-bar-style"><meta content="telephone=no" name="format-detection">
	<style type="text/css">/* Client-specific Styles */
        #outlook a {padding:0;} /* Force Outlook to provide a "view in browser" menu link. */
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        /* Prevent Webkit and Windows Mobile platforms from changing default font sizes, while not breaking desktop design. */
        .ExternalClass {width:100%;} /* Force Hotmail to display emails at full width */
		.ExternalClass {width:100%;} /* Force Gmail to display emails at full width */
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing.*/
        img {outline:none; text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}
		a { color:#616161; text-decoration:none }
		p { padding:0 !important; margin:0 !important } 

		.text-footer-2 a { color: #b1b1b1; text-decoration: none; }
		
	 @media only screen and (max-width: 700px) {
		 table.container{
                width:100% !important;
            }
		 .gizle{
			 	display:none !important;
			}
		 img.resim {
				width:100% !important;
				height:auto !important;
			} 
		div.container{
                width:100% !important;
            }
				*[class*="onlymobile"] {
      display: block !important;
      max-height: none !important;
    }
 
		 
		 #logo {height:28px !important;
      margin-top:3px;
    }
    .main-table, .main-content img { width:100% !important;}
    #navcontainer{
      position:relative;
    }
    #navcontainer th{
      display:block;
      width: 100%;
      border-bottom:2px solid #ffffff;
      height:18px;
      padding: 10px 0px;      
    }
    #menucontainer{
      position:relative;
      overflow:hidden;
    }
    #navcontainer table{
      margin-top:-600px;
      -ms-transition: margin-top .5s ease-in-out;
      -webkit-transition: margin-top .5s ease-in-out;      
    }
    /* checkbox mechanism */
    #navcheckbox:checked + table{
      margin-top:0%;
    }      
    /* fallback hover mechanism */
    .nav-over,.nav-under{
     display:block !important;
     max-height:none !important;
     padding-top:3px;
     padding-bottom:3px;
    } 
    .nav-over img,.nav-under img{
     display:block;
     float:center;
     
	 
    } 
    /*
    to deal with quirks in windows 8.1 and Outlook and Gmail iOS
    */
    .nav-over{
     -ms-transition-delay: 1.5s;
     -webkit-transition-delay: 1.5s;            
    }
    #navcontainer > .nav-over:hover + div table{
      margin-top:0% !important;
    }
    #navcontainer > .nav-over:hover{
      visibility:hidden;
    }
	 }
		 @media screen and (min-width: 500px) {
		img.buyut { 
				width:100% !important;
				height:auto !important;
			}
		div.genislet {
				width:95% !important;
			}
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
						<td align="center" class="ortala" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; text-align:left; padding:5px;"><span style="font-size:16px;">Değerli m&uuml;şterimiz,</span><br />
						&nbsp;</td>
					</tr>
					<tr>
						<td align="center" class="ortala" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; text-align:left; padding:5px;">%%proje%% projesinde bulunan %%sozlesme%% numaralı s&ouml;zleşmenize ait %%tutar%% TL borcunuz bulunmaktadır. %%tarih%% tarihi itibarıyla s&ouml;zleşmenizin sonlandırılacağını &uuml;z&uuml;lerek bilgilerinize sunarız. Herhangi bir sorunuz olması halinde bizimle 444 76 80 no&#39;lu telefondan iletişime ge&ccedil;ebilirsiniz.<br />
						<br />
						&Ouml;DEME YAPILDIYSA MESAJI DİKKATE ALMAYINIZ.<br />
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
						<td align="center" bgcolor="#980748" color="#ffffff" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#454545; padding:10px;" width="100%"><span style="color:#ffffff;">Sultantepe Mahallesi H&uuml;seyin Baykara Sokak No:1/3 34674 &Uuml;sk&uuml;dar / İSTANBUL Tel: 444 76 80 E-mail:&nbsp;rig@arileasing.com.tr<br />
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

export default toTerminatedRiskPartnersEmailTemplate;
