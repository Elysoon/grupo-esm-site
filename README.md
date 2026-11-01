# Site do Grupo ESM

Site estático (HTML, CSS e JavaScript puro), sem banco de dados e sem cookies.
Endereço: https://grupoesm.com.br

## Pastas

| Caminho | O que tem |
|---|---|
| `index.html` | Todas as páginas e textos: início, serviços e os 3 pilares, sistemas, loja, empresas do grupo, credenciamento, afiliados, sobre, contato e páginas legais |
| `data/dados.json` | Sistemas, empresas do grupo, planos de credenciamento e empresas credenciadas |
| `css/site.css` | Base do visual (fontes, grade, páginas) |
| `css/visual.css` | Visual minimalista: cores, cartões, botões, cabeçalho |
| `js/site.js` | Páginas, menu Serviços, catálogo, loja, credenciados, diagnóstico e WhatsApp |
| `fonts/`, `img/` | Fonte Lato e logos oficiais |
| `.htaccess`, `_headers` | Regras de segurança (Apache e Cloudflare Pages) |

## Ver no computador

Dê dois cliques em `Ver-Site.bat`. O site abre em http://localhost:8080. Abrir o `index.html` direto não carrega as listas.

## Preços e botão "Assinar"

Em `data/dados.json`, cada sistema e cada plano de credenciamento tem `preco` e `linkCompra`.
Com os dois preenchidos (o link é o link de pagamento do ESM Pay, começando com `https://`), o botão vira "Assinar".
Sem preço, o botão mostra "Pedir valores" e abre o WhatsApp.

## Pendências

Textos marcados com `[PREENCHER]` não aparecem para o visitante. Os principais:
- prazo para devolver o dinheiro (Troca e Reembolso);
- se haverá reembolso proporcional no cancelamento;
- regras do contrato de credenciamento;
- recursos de alguns sistemas.
