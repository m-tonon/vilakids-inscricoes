export const confirmationTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inscrita confirmada no 6º Acampa Kids</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif; color: #262626">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4">
      <tr>
        <td align="center" style="padding: 20px 12px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden">
            <tr>
              <td align="center" style="background-color: #1a1a1a; padding: 24px">
                <img src="https://i.ibb.co/W4k3csJw/vila-kids-logo.png" alt="IPVO - Igreja Presbiteriana da Vila Operaria" width="160" style="display: block; max-width: 160px; height: auto; border: 0" />
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 24px 24px">
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5">
                  <strong>Olá, {{nomeParticipante}}!</strong>
                </p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5">
                  Temos uma boa notícia: sua inscrição no <strong>6º Acampa Kids</strong> foi concluída com sucesso!
                </p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5">
                  O pagamento foi confirmado e sua vaga está garantida.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 6px; margin: 16px 0">
                  <tr>
                    <td style="padding: 16px">
                      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5"><strong>📅 Data:</strong> 30 de outubro a 01 de novembro de 2026</p>
                      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5"><strong>📍 Local:</strong> Acampamento Evangélico Maanaim</p>
                      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5"><strong>👶 Faixa etária:</strong> 06 a 11 anos</p>
                      <p style="margin: 0 0 0; font-size: 14px; line-height: 1.5"><strong>💰 Valor pago:</strong> R$ {{price}}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5">
                  Em breve você receberá mais informações sobre o acampamento. Fique de olho no seu e-mail e no WhatsApp do grupo.
                </p>
                <p style="margin: 0 0 0; font-size: 16px; line-height: 1.5">
                  Abraços,<br />
                  <strong>IPVO - Igreja Presbiteriana da Vila Operária</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #1a1a1a; padding: 16px 24px">
                <p style="margin: 0; font-size: 12px; color: #8c8c8c">
                  IPVO - Igreja Presbiteriana da Vila Operária<br />
                  (44) 3226-4473
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;