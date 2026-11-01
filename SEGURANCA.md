# Grupo ESM: segurança e parte jurídica do site

Este arquivo fica só no seu computador. Não suba para a hospedagem (o `.htaccess` bloqueia arquivos `.md` caso ele vá junto por engano).

## O que já está no site

| Item | Onde está | Para que serve |
|---|---|---|
| HTTPS obrigatório e HSTS | `.htaccess`, `_headers` | Ninguém consegue ler ou alterar a conexão |
| Política de segurança de conteúdo (CSP) | `.htaccess`, `_headers` e `<meta>` no `index.html` | O site só roda arquivos dele mesmo, o que bloqueia scripts injetados |
| Anti-clickjacking | `frame-ancestors 'none'` e `X-Frame-Options` | Impede que outro site abra o seu dentro de uma moldura para enganar visitantes |
| Bloqueio de câmera, microfone, localização e pagamento | `Permissions-Policy` | O site não pede nem usa essas permissões |
| Arquivos ocultos e backups bloqueados | `.htaccess` | `.git`, `.env`, `.md`, `.zip` e parecidos não podem ser baixados |
| Sem listagem de pastas | `Options -Indexes` | Ninguém vê os arquivos de uma pasta |
| Fontes hospedadas no próprio site | `fonts/` | A visita não é repassada ao Google (LGPD) |
| Formulário sem banco de dados | `js/site.js` | Nada fica gravado; a mensagem só sai pelo WhatsApp, com confirmação |
| Consentimento antes do envio | caixa no formulário | Registra que a pessoa leu a Política de Privacidade |
| Limite de tamanho nos campos | `maxlength` e `site.js` | Evita mensagens gigantes e caracteres de controle |
| Canal para avisar falhas | `.well-known/security.txt` | Padrão RFC 9116. Renove a data `Expires` todo ano |
| Política de Privacidade | página `#privacidade` | LGPD, art. 9º (informação clara ao titular) |
| Termos de Uso | página `#termos` | Regras de uso, marca, foro |
| Canal do titular | e-mail na política | Pequeno porte dispensa encarregado (DPO), mas exige canal (Resolução CD/ANPD nº 2/2022) |

## O que você precisa fazer

1. **Preencher a razão social e o CNPJ da holding** nas duas páginas jurídicas. Procure por `[razão social e CNPJ da holding]` no `index.html`.
2. **Confirmar o e-mail** `contato@grupoesm.com.br`. Se for outro, troque em todo o `index.html` e no `security.txt`.
3. **Ativar o SSL (HTTPS)** no painel da hospedagem **antes** de subir o `.htaccess`. Sem SSL, a regra de HTTPS deixa o site fora do ar.
4. **Registro.br:** ligar a verificação em duas etapas e o bloqueio de transferência do domínio.
5. **E-mail corporativo:** configurar SPF, DKIM e DMARC no DNS. Sem isso, golpistas conseguem mandar e-mail falso "em nome" do grupo, e os seus e-mails caem no spam.
6. **INPI:** registrar a marca "Grupo ESM" (e a logo). A Lei 9.279/1996 só garante exclusividade com o registro.
7. **Revisão jurídica:** os textos seguem o padrão do mercado e a LGPD, mas peça a um advogado ou ao contador para revisar antes de divulgar.

## Depois de publicar, testar

- https://securityheaders.com: a nota deve ser A ou A+.
- https://www.ssllabs.com/ssltest: a nota deve ser A.
- Abrir `https://grupoesm.com.br/.git/` e `https://grupoesm.com.br/SEGURANCA.md`: os dois devem dar erro 403.
