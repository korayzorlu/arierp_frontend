const emlakWhatsappMessageTemplate = ({ isim = '', link = '', tutar = '', toplanti_tarihi = '', online_toplanti_tarihi = '' }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Satışlarınızı Hızlandırın</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<style type="text/css">
		body{width:100% !important; margin:0; padding:0;}
		img {outline:none; text-decoration:none; border:none; -ms-interpolation-mode: bicubic;}
		p { margin:0 0 16px 0 !important; padding:0 !important; }
		@media only screen and (max-width: 700px) {
			table.wrapbg{ width:100% !important; }
			table.container{ width:94% !important; }
			img.resim { width:100% !important; height:auto !important; }
		}
	</style>
</head>
<body leftmargin="0" marginheight="0" marginwidth="0" topmargin="0">
<!-- WHATSAPP SOHBET ARKA PLANI -->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapbg" bgcolor="#e5ddd5" style="background-color:#e5ddd5;">
	<tbody>
		<tr>
			<td align="center" style="padding:24px 0;">

			<!-- MESAJ BALONU -->
			<table align="center" border="0" cellpadding="0" cellspacing="0" class="container" width="480" bgcolor="#ffffff" style="background-color:#ffffff; border-radius:8px; box-shadow:0 1px 1px rgba(0,0,0,0.15);">
				<tbody>
					<tr>
						<td align="center" style="border-radius:8px 8px 0 0; overflow:hidden;">
							<img alt="Ari Leasing - Satışlarınızı Hızlandırın" class="resim" src="https://emlak.arileasing.com.tr/staticfiles/images/global/emlak-wb-image.jpg" style="border-width:0px; border-style:solid; display:block; border-radius:8px 8px 0 0;" width="480" />
						</td>
					</tr>
					<tr>
						<td align="left" style="font-family:-apple-system,Helvetica,Arial,sans-serif; font-size:14.2px; line-height:19px; padding:8px 9px 6px 9px; color:#111b21;">

							<p>Sayın {isim},</p>

							<p>Kat mülkiyetli konutları Finansal Kiralama ile satabilirsiniz. Böylece mevcut komisyonunuza ek %2+kdv satış primi alırsınız. Modeli gerçek rakamlarla anlatıyoruz, toplantımıza davetlisiniz.</p>

							<p>{toplanti_tarihi} --&gt; Sinpaş Plaza, Konferans Salonu (Dikilitaş mah. Yenidoğan sk. No:36 Beşiktaş/İSTANBUL)</p>

							<p>{online_toplanti_tarihi} --&gt; Microsoft Teams - Çevrimiçi</p>

							<p>Toplantıya kayıt için lütfen bağlantıya tıklayın.</p>

							<p style="margin-bottom:0 !important;">Arı Leasing | Sinpaş Grubu iştiraki</p>

						</td>
					</tr>
					<tr>
						<td align="left" style="padding:2px 9px 12px 9px; border-radius:0 0 8px 8px;">
							<a href="{link}" target="_blank" style="font-family:-apple-system,Helvetica,Arial,sans-serif; font-size:14.2px; color:#00a884; text-decoration:none; font-weight:600;">
								<span style="vertical-align:middle;">&#8599;</span> <span style="vertical-align:middle;">Kayıt Ol</span>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- /MESAJ BALONU -->

			</td>
		</tr>
	</tbody>
</table>
</body>
</html>
`;

export default emlakWhatsappMessageTemplate;
