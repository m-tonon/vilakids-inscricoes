
export const confirmationTemplate = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1"
    />
    <title>Confirmação de Inscrição – Acampa Vila Kids</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      /* --- basic reset --- */
      body,
      table,
      td,
      p {
        margin: 0;
        padding: 0;
        font-family:
          'Inter',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
        line-height: 1.45;
        color: #1a1a1a;
      }
      img {
        border: 0;
        display: block;
        width: 100%;
        height: auto;
        margin-bottom: 2rem;
      }
      a {
        color: #0066ff;
        text-decoration: none;
      }
      /* --- helpers --- */
      .wrapper {
        width: 100%;
        background: #f7f7f7;
        padding: 24px 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .content {
        padding: 0 32px 32px;
      }
      h1 {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 16px;
      }
      ul {
        padding-left: 20px;
        margin: 8px 0;
      }
      li {
        margin-bottom: 4px;
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      class="wrapper"
      width="100%"
      cellspacing="0"
      cellpadding="0"
    >
      <tr>
        <td align="center">
          <!-- CARD -->
          <table
            role="presentation"
            class="container"
            width="100%"
            cellspacing="0"
            cellpadding="0"
          >
            <!-- HERO IMAGE -->
            <tr>
              <td>
                <img
                  src="https://i.ibb.co/S4572SNh/vilakids-camp.jpg"
                  alt="5º Acampa Kids – 03, 04 e 05 de Outubro"
                />
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td class="content">
                <p>Olá, <strong>{{nomeParticipante}}</strong></p>
                <br />

                <p>
                  Temos uma ótima notícia:
                  <strong
                    >sua inscrição no 5º Acampa Kids foi concluída com
                    sucesso!</strong
                  >
                  🎉
                </p>
                <br />

                <h1>📍 Informações do acampamento:</h1>
                <ul style="list-style: none; padding-left: 0">
                  <li>
                    📅 <strong>Data:</strong> 03 a 05 de outubro
                  </li>
                  <li>
                    📍 <strong>Local:</strong> Acampamento Evangélico Maanaim
                  </li>
                  <li>🧑‍🤝‍🧑 <strong>Faixa etária:</strong> 06 a 11 anos</li>
                  <li>💰 <strong>Valor pago:</strong> R$ 210</li>
                  <li>
                    ✅ <strong>Inscrição confirmada:</strong> Sim! Seu nome já
                    está na nossa lista.
                  </li>
                </ul>
                <br />

                <p>
                  Estamos muito felizes por ter você com a gente!<br />Será um
                  tempo inesquecível de comunhão, diversão, aprendizado da
                  Palavra e crescimento espiritual. 🙏🔥
                </p>
                <br />

                <p>
                  Se você tiver qualquer dúvida ou precisar de mais informações,
                  é só entrar em contato com a equipe do acampamento.
                </p>

                <p>Nos vemos lá!<br /><br /><strong>Equipe VilaKids</strong></p>
              </td>
            </tr>
          </table>
          <!-- /CARD -->
        </td>
      </tr>
    </table>
  </body>
</html>
`