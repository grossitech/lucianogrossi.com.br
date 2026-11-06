# DESIGN.md — lucianogrossi.com.br

Sistema de design do site. Descreve o que o site **já é**, para que páginas novas pareçam do mesmo lugar. Quem for criar ou alterar uma página (pessoa ou IA) lê este arquivo antes.

**Regra de manutenção:** qualquer mudança visual no site (cor, fonte, espaçamento, componente novo ou alterado) atualiza este arquivo no mesmo commit. Se o site e este arquivo discordarem, o arquivo está desatualizado: corrija-o.

Última revisão: 2026-11-06.

---

## Princípios

1. **Escuro, quieto e tipográfico.** Fundo quase preto, texto claro, muito espaço em branco. O peso visual vem das letras, não de imagens ou caixas.
2. **Um único destaque: o laranja.** Ele marca o que importa (a palavra em ênfase, um rótulo, um link). Se tudo é laranja, nada é.
3. **Duas vozes tipográficas.** DM Sans leve para ler; DM Mono pequena para rotular (datas, códigos, metadados).
4. **Movimento só com motivo.** Entrada suave e hover discreto. Nada pisca, gira ou se move sozinho em loop.
5. **HTML, CSS e JavaScript puros.** Sem framework, sem bundler, sem dependências além do Google Fonts.

---

## Cores

Definidas como variáveis em `style.css` (`:root`). Use sempre a variável, nunca o valor direto.

| Variável | Valor | Uso |
|---|---|---|
| `--bg` | `#0a0a0a` | fundo da página |
| `--bg2` | `#111111` | cartões, caixas de destaque, blocos de código |
| `--bg3` | `#1a1a1a` | campos de formulário, fundo de ícones, código inline |
| `--border` | `rgba(255,255,255,0.07)` | todas as bordas e divisórias |
| `--border-hover` | `rgba(255,255,255,0.15)` | borda no hover e botão de contorno |
| `--text` | `#f0ede8` | texto principal e títulos |
| `--muted` | `#888` | texto secundário, descrições, metadados |
| `--accent` | `#ff6b2b` | o laranja: ênfase, rótulos, links, números de destaque |
| `--accent-dark` | `#e05520` | hover do botão principal |

Transparências do laranja usadas hoje: `rgba(255,107,43,0.1)` no fundo dos códigos de categoria do catálogo OSINT; `0.3` e `0.12` na borda e no brilho da foto da home; `0.04` no brilho de fundo do topo da home.

### Contraste (WCAG)

Medido sobre `--bg` (`#0a0a0a`). AA exige 4,5:1 para texto normal e 3:1 para texto grande.

| Texto | Sobre `--bg` | Sobre `--bg2` | Sobre `--bg3` | Pode ser texto? |
|---|---|---|---|---|
| `--text` | 17,0 | 16,2 | 14,9 | sim, em qualquer tamanho |
| `--muted` | 5,6 | 5,3 | 4,9 | sim (passa AA) |
| `--accent` | 7,0 | 6,6 | 6,1 | sim, inclusive texto pequeno |
| `--accent-dark` | 5,2 | 4,9 | 4,5 | sim, no limite sobre `--bg3` |

**Nunca** ponha texto claro sobre fundo laranja: branco sobre `--accent` dá 2,8:1 e reprova. Sobre laranja, o texto é `--bg` (7,0:1), como no botão principal.

---

## Tipografia

Carregadas do Google Fonts em todas as páginas:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Variável | Fonte | Uso |
|---|---|---|
| `--sans` | DM Sans | corpo, títulos, cartões |
| `--mono` | DM Mono | rótulos, datas, códigos, metadados, rodapé, botões |

Pesos: **300** é o padrão (corpo e títulos grandes); **400** para títulos de item e cartões; **500** só para negrito no texto. Nunca use 600 ou 700: a fonte não é carregada nesses pesos.

| Elemento | Tamanho | Peso | Observação |
|---|---|---|---|
| Título da home (`h1`) | `clamp(2.8rem, 6vw, 5rem)` | 300 | `letter-spacing: -0.02em`, `line-height: 1.08` |
| Título de página interna (`h1`) | `clamp(2rem, 5vw, 3rem)` | 300 | `line-height: 1.1` |
| Título de seção (`h2`) | `2rem` (home) · `1.3rem` (artigos) | 300 / 400 | |
| Corpo | `1rem` | 300 | `line-height: 1.7` |
| Texto de apoio (lead, descrição) | `0.95rem` a `1.1rem` | 300 | cor `--muted` |
| Rótulo em mono | `10px` a `12px` | 400 | maiúsculas e `letter-spacing` de `0.04em` a `0.12em` |

### Ênfase em laranja no título

A palavra ou expressão principal do `h1` vai em `<em>`, que o `style.css` pinta de laranja e deixa sem itálico:

```html
<h1>Kit de<br><em>Ferramentas OSINT</em></h1>
```

Uma ênfase por título.

---

## Layout

| Contexto | Largura máxima | Respiro |
|---|---|---|
| Home (seções) | `1100px` | `padding: 5rem 2rem` por seção |
| Catálogo OSINT | `1120px` | `padding: 8rem 2rem 5rem` |
| Ferramentas pequenas (contador etc.) | `780px` | `padding: 8rem 2rem 5rem` |
| Artigos (texto longo) | `760px` | `padding: 8rem 2rem 5rem` |

- O `8rem` no topo das páginas internas compensa o menu fixo (cerca de 63 px de altura).
- Seções da home são separadas por `border-top: 1px solid var(--border)`.
- Raios de borda pequenos: `4px` em cartões e campos, `2px`–`3px` em etiquetas. Nada arredondado demais.
- Celular: abaixo de **600px**, grades de duas colunas viram uma e o menu esconde os links, ficando só o logo (regra em `style.css`, vale para todas as páginas).
- Nenhum elemento, nem decorativo, pode passar da largura da tela: no celular isso alarga a página inteira. Decoração posicionada fora do bloco precisa de `overflow-x: clip` no pai, como o brilho do topo da home.

---

## Componentes

### Menu (todas as páginas)

Fixo no topo, fundo `rgba(10,10,10,0.85)` com `backdrop-filter: blur(12px)`, borda inferior. À esquerda, o logo `lg.dev` em mono laranja; à direita, links em `--muted` que ficam `--text` no hover.

```html
<nav>
  <a href="/" class="nav-logo">lg.dev</a>
  <div class="nav-links">
    <a href="/#sobre">sobre</a>
    <a href="/#experiencia">experiência</a>
    <a href="/#projetos">projetos</a>
    <a href="/artigos/">artigos</a>
    <a href="/#contato">contato</a>
  </div>
</nav>
```

Na home (`index.html`), os links usam âncoras locais: sobre, projetos, artigos, ferramentas, experiência, contato.

### Rótulo de página

Mono, laranja, maiúsculas, com um traço de 24 px à esquerda. Fica acima do `h1` das páginas internas.

```html
<div class="page-tag">Série OSINT · Parte 3 de 8</div>
```

Na home, o equivalente é `.hero-tag`; nas seções, `.section-label` com a numeração `// 01`, `// 02`… Ao incluir ou remover uma seção da home, renumere todas.

### Botões

`.btn` em mono 13px. `.btn-primary` (fundo laranja, texto `--bg`) para a ação principal, uma por tela; `.btn-outline` (contorno) para as demais.

### Cartão de link (`.contact-card`)

Usado em Projetos, Ferramentas e Contato da home. Borda fina, ícone SVG de 16px em laranja dentro de um quadrado `--bg3` de 36px, título em `--text` 13px (`.card-title`) e uma linha de apoio em mono 11px (`.card-sub`). Hover só clareia a borda e o texto. Grade de duas colunas, uma no celular.

Ordem nas grades: o mais novo ou mais importante primeiro.

### Linha do tempo (`.timeline-item`)

Grade de `180px` + resto. À esquerda, período em mono 11px `--muted`; à direita, papel (`.timeline-role`, 400), organização em mono laranja (`.timeline-company`), descrição em `--muted` e etiquetas. Usada em Experiência, Palestras e Formação.

Variação para listas: `.cert-list`, com nome à esquerda e metadados em mono à direita (`instituição · ano · horas`).

### Etiquetas

`.tag` (mono 10px com borda) para assuntos; `.skill-tag` (com bolinha laranja) para os destaques do Sobre.

### Artigos

Artigos ficam em `/artigos/<série>/<artigo>/`, com índice da série em `/artigos/<série>/` e índice geral em `/artigos/`. Endereços em minúsculas, palavras separadas por hífen, sem `.html`. Estilos em `guia.css`.

Ordem do topo de um artigo: rótulo de página (`Série X · Parte N de T`), `h1` com uma ênfase, **assinatura** e texto de apoio (`.lead`).

```html
<p class="byline">por Luciano Grossi · <time datetime="2026-10-10">10 de outubro de 2026</time> · 3 min de leitura</p>
```

O tempo de leitura conta 200 palavras por minuto. No fim do artigo, nesta ordem: caixa de destaque, link para o catálogo (quando houver), **Leia também** (`.leia`, com um artigo relacionado de outra série quando o assunto cruza e o link para a outra série) e a navegação anterior/próxima (`.cap-nav`).

Cada artigo tem `meta description` e as tags Open Graph (`og:type` article, título, descrição, URL, data de publicação). Ao mover um artigo de endereço, o antigo vira página de redirecionamento com `noindex`, como os antigos `/osint/guia/` e `/audiovisual/guia/`.

### Caixa de destaque (artigos)

`.defesa` em `guia.css`: fundo `--bg2`, borda, e **borda esquerda de 2px laranja**. Título interno em mono laranja maiúsculo (`h3`). Usada para "Do lado da defesa" (OSINT) e "Na prática" (curtas).

### Tabelas e código (artigos)

Tabelas sem fundo, só linhas divisórias; cabeçalho em mono 10px `--muted` maiúsculo. Código inline com fundo `--bg3`; blocos `pre` com fundo `--bg2`.

### Rodapé (todas as páginas)

Centralizado, mono 11px `--muted`, links em laranja. Nas páginas internas, primeiro o link de volta, depois o copyright:

```html
<footer>
  <p><a href="/">← lucianogrossi.com.br</a></p>
  <p>© 2026 Luciano Grossi · lucianogrossi.com.br</p>
</footer>
```

Na home, só o copyright. **Em janeiro, atualizar o ano em todas as páginas.**

### Links no texto

- Em parágrafos da home: texto `--text` com sublinhado laranja de 1px (`border-bottom`), laranja no hover. Use pouco: no Sobre há só dois.
- Em artigos e catálogos: laranja, sem sublinhado, sublinhado no hover.
- No parágrafo de abertura de seção da home (`.section-intro a`): o mesmo estilo dos parágrafos.
- Links externos abrem em nova aba com `target="_blank" rel="noopener"`.

---

## Movimento

- **Entrada:** a animação `fadeUp` (sobe 16px e aparece, 0,6 s) é usada só no topo da home, em cascata de 0,1 s.
- **Hover:** transições de `0.2s` em cor e borda; os cartões do catálogo sobem 1px.
- **Rolagem:** `scroll-behavior: smooth`.
- Animação nova precisa de motivo (seguir, revelar ou enfatizar) e deve respeitar `@media (prefers-reduced-motion: reduce)`, desligando-se para quem pediu menos movimento.
- Vídeo de fundo, quando houver: sem áudio, em loop, abaixo de ~1 MB, com `poster` e `autoplay muted loop playsinline`.

---

## Texto e tom

- Português do Brasil, frases diretas, primeira pessoa no Sobre.
- Sem superlativos de marketing ("incrível", "épico", "revolucionário") e sem exclamações.
- Termo estrangeiro aparece explicado na primeira vez: "Inteligência de Fontes Abertas (*Open Source Intelligence*, ou OSINT)".
- **Siglas explicadas** na primeira vez que aparecem em cada texto, com a origem e o significado por extenso. Ex.: "OSINT vem do inglês *Open Source Intelligence*, que significa Inteligência de Fontes Abertas". A lista de exceções (siglas de uso comum, como CPF e PDF) está no `CLAUDE.md`.
- Nomes de cargos e instituições como no documento oficial.
- Artigos são escritos do zero, sem copiar material de cursos.

---

## Estrutura e arquivos

| Arquivo | Papel |
|---|---|
| `style.css` | variáveis, reset, menu, botões, rótulo de página, rodapé. Base de todas as páginas |
| `index.html` | home, com os estilos próprios em `<style>` |
| `guia.css` | estilos dos artigos (`/artigos/`) |
| `osint/catalogo.css` · `catalogo.js` | catálogo com busca, gerado de `osint/ferramentas.json` |

Todo CSS e JS é linkado com `?v=N` (`style.css?v=2`, `guia.css?v=3`, `catalogo.css?v=2`, `catalogo.js?v=2`). Ao mudar um desses arquivos, aumente o número em todas as páginas que o usam, para o navegador não servir a versão antiga.

Na home, seções com divisória usam `.sec-border` e o parágrafo de abertura de seção usa `.section-intro` (`.section-intro.tight` quando vem seguido de lista). Não use `style="..."` no HTML: crie uma classe.

### Página nova: checklist

1. Pasta própria com `index.html` (URL limpa, em minúsculas).
2. `<!DOCTYPE html>`, `lang="pt-BR"`, `title` no formato `Nome | Luciano Grossi`, `meta description`, `canonical` e favicon.
3. Fontes, `style.css` e o CSS do tipo de página.
4. Menu e rodapé padrão.
5. Rótulo de página, `h1` com uma ênfase em laranja e um texto de apoio.
6. Card na home (se for pública), linha no `README.md` e entrada no `sitemap.xml`.
7. Página reservada (sem divulgação): `meta name="robots" content="noindex, nofollow"` e nenhum link apontando para ela.

---

## Pendências conhecidas

Diferenças que já existem e ainda não foram corrigidas. Ao resolver uma, remova-a daqui.

- **Larguras de página:** 1100, 1120, 780 e 760 px convivem. Não é erro, mas uma página nova deve escolher uma das existentes.
- **Regras repetidas:** `catalogo.css` e `guia.css` ainda escondem `.nav-links` no celular, o que agora já vem do `style.css`. Inofensivo; dá para remover na próxima mudança desses arquivos.
