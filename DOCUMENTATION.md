# Documentação — `portfolio.config.json`

> 🇧🇷 Esta é a documentação em português. Uma versão em inglês está a caminho.

Este documento explica **cada campo** do arquivo `portfolio.config.json` (localizado na raiz do projeto) e **como funciona o sistema de blog**. Não é necessário programar para usar nada do que está aqui — tudo é feito editando JSON e/ou criando arquivos `.md`.

## Índice

1. [Visão geral](#visão-geral)
2. [Removendo seções](#removendo-seções)
3. [`meta`](#meta)
4. [`person`](#person)
5. [`about`](#about)
6. [`workExperience`](#workexperience)
7. [`projects`](#projects)
8. [`skills`](#skills)
9. [`blog`](#blog)
10. [`discordActivity`](#discordactivity)
11. [`credits`](#credits)
12. [`animations`](#animations)
13. [Texto rico (rich text)](#texto-rico-rich-text)
14. [Sistema de blog (`src/content/blog/*.md`)](#sistema-de-blog-srccontentblogmd)
15. [Rodando o projeto localmente](#rodando-o-projeto-localmente)

---

## Visão geral

O arquivo `portfolio.config.json` é dividido em blocos, um por seção do site:

```json
{
  "meta": { ... },
  "person": { ... },
  "about": { ... },
  "workExperience": [ ... ],
  "projects": [ ... ],
  "skills": [ ... ],
  "blog": { ... },
  "discordActivity": { ... },
  "credits": { ... },
  "animations": { ... }
}
```

`meta` e `person` são **obrigatórios** (o site não funciona sem eles). Todos os outros blocos (`about`, `workExperience`, `projects`, `skills`, `blog`, `discordActivity`, `credits`) são **opcionais** — veja a seção seguinte.

## Removendo seções

Qualquer seção opcional pode ser removida do site colocando `null` no lugar do valor, por exemplo:

```json
"projects": null
```

Isso faz a seção "Projetos" desaparecer completamente da página — sem deixar título vazio, sem espaço em branco. Isso vale para: `about`, `workExperience`, `projects`, `skills`, `blog`, `discordActivity` e `credits`.

> Arrays vazios (`[]`) têm o mesmo efeito de `null` para `workExperience`, `projects` e `skills` — a seção some se não houver nenhum item.

---

## `meta`

Configurações gerais do site.

```json
"meta": {
  "siteTitle": "Matheus Audibert",
  "siteDescription": "Software Engineer",
  "ogImage": "https://exemplo.com/preview.png",
  "favicon": "https://exemplo.com/avatar.png",
  "defaultTheme": "light",
  "scale": "small",
  "language": "pt"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `siteTitle` | `string` | Sim | Título da aba do navegador e metadados (`<title>`, Open Graph, Twitter Card). |
| `siteDescription` | `string` | Sim | Descrição usada nos metadados da página (SEO, prévia ao compartilhar o link). |
| `ogImage` | `string` (URL) | Sim | Imagem usada na prévia ao compartilhar o link (Open Graph / Twitter Card). |
| `favicon` | `string` (URL) | Não (padrão: `person.avatar`) | Imagem usada como ícone da aba do navegador (favicon). |
| `defaultTheme` | `"light"` \| `"dark"` \| `"system"` | Sim | Tema inicial do site. `"system"` segue a preferência do sistema operacional do visitante. O visitante ainda pode trocar manualmente pelo botão de tema. |
| `scale` | `"small"` \| `"medium"` \| `"high"` | Não (padrão: `"small"`) | Controla o tamanho geral de fontes, ícones e espaçamentos. Veja [Escala visual](#escala-visual). |
| `language` | `"pt"` \| `"en"` | Não (padrão: `"en"`) | Idioma dos **títulos das seções** (Sobre/About, Projetos/Projects, etc.). Não traduz o conteúdo que você mesmo escreve. |

### Escala visual

`meta.scale` tem 3 níveis:

| Valor | Efeito |
|---|---|
| `"small"` | Tamanho padrão (100%) — o baseline original do design. |
| `"medium"` | Aumenta fontes, ícones, avatar e espaçamentos em **25%**. |
| `"high"` | Aumenta fontes, ícones, avatar e espaçamentos em **50%**. |

Diferente de um `zoom` de CSS, esse aumento é real: os valores de `font-size` e pixels dos componentes são recalculados, então o layout continua nítido e responsivo em qualquer nível.

---

## `person`

Suas informações pessoais e redes sociais, exibidas no cabeçalho do site.

```json
"person": {
  "name": "Matheus Audibert",
  "title": "Software Engineer",
  "location": "São Paulo, Brazil",
  "avatar": "https://github.com/matheusaudibert.png",
  "social": [
    { "label": "Email", "href": "mailto:voce@exemplo.com", "icon": "email" },
    { "label": "GitHub", "href": "https://github.com/seu-usuario", "icon": "github" }
  ]
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | Sim | Seu nome, exibido em destaque no topo do site. |
| `title` | `string` | Sim | Seu cargo/título (ex: "Software Engineer"). |
| `location` | `string` | Sim | Sua localização, exibida com um ícone de globo. |
| `avatar` | `string` (URL) | Sim | URL da sua foto de perfil. |
| `social` | array de objetos | Sim (pode ser `[]`) | Lista de redes sociais/links. |

### `person.social[]`

Cada item da lista `social` tem:

| Campo | Tipo | Descrição |
|---|---|---|
| `label` | `string` | Texto acessível do botão (usado em `aria-label` e como tooltip). |
| `href` | `string` (URL) | Link de destino. |
| `icon` | `string` | Um dos ícones abaixo. |

Ícones disponíveis (`icon`):

`email` · `resume` · `github` · `linkedin` · `instagram` · `x` · `youtube`

> ⚠️ **Limite de exibição:** você pode colocar quantos itens quiser em `social`, mas **apenas os 6 primeiros** são exibidos no site. Reordene a lista se quiser priorizar outra rede.

---

## `about`

O texto de apresentação/bio, exibido na seção "Sobre".

```json
"about": {
  "text": "Software Engineer apaixonado por construir sistemas escaláveis, atualmente cursando Engenharia de Software na [@fiap](https://www.fiap.com.br/){#ff0077}."
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `text` | `string` ou `string[]` | O texto da bio. Use uma `string` para um único parágrafo, ou um array de strings para múltiplos parágrafos. |

Suporta [texto rico](#texto-rico-rich-text) completo: negrito, itálico, riscado, código e links com cor customizada.

Exemplo com múltiplos parágrafos:

```json
"about": {
  "text": [
    "Primeiro parágrafo da bio.",
    "Segundo parágrafo, numa linha separada."
  ]
}
```

Para remover a seção "Sobre" inteira, use `"about": null`.

---

## `workExperience`

Lista das suas experiências profissionais, exibida na seção "Experiência Profissional".

```json
"workExperience": [
  {
    "company": "Itaú Unibanco",
    "companyUrl": "https://www.itau.com.br",
    "companyImage": "https://exemplo.com/preview-itau.png",
    "companyDescription": "Maior banco da América Latina.",
    "role": "Software Engineer",
    "period": "Setembro 2025 - Presente",
    "tags": ["Híbrido", "Python", "AWS"],
    "bullets": [
      "Construí uma infraestrutura completa na [AWS]{#FF9900}.",
      "Reduzi em **90+ horas por mês** o trabalho manual da equipe."
    ]
  }
]
```

Cada item do array `workExperience` tem:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `company` | `string` | Sim | Nome da empresa. |
| `companyUrl` | `string` (URL) | Sim | Link do site da empresa (o nome da empresa vira um link para essa URL). |
| `companyImage` | `string` (URL) | Não | Imagem exibida num preview flutuante ao passar o mouse sobre o nome da empresa (desktop). Se omitido, nenhum preview é exibido. |
| `companyDescription` | `string` | Não | Uma frase curta descrevendo a empresa. Suporta [texto rico](#texto-rico-rich-text). |
| `role` | `string` | Sim | Seu cargo na empresa. |
| `period` | `string` | Sim | Período trabalhado (texto livre, ex: `"Setembro 2025 - Presente"`). |
| `tags` | `string[]` | Sim (pode ser `[]`) | Tags exibidas ao lado do nome da empresa (ex: modalidade, tecnologias). |
| `bullets` | `string[]` | Sim (pode ser `[]`) | Lista de realizações/responsabilidades, exibida como bullet points. Cada item suporta [texto rico](#texto-rico-rich-text). |

> ⚠️ **Limite de exibição:** você pode colocar quantas `tags` quiser, mas **apenas as 5 primeiras** são exibidas.

Para remover a seção inteira, use `"workExperience": null`.

---

## `projects`

Lista dos seus projetos, exibida na seção "Projetos" como cards.

```json
"projects": [
  {
    "title": "Commitly",
    "description": "Uma ferramenta web que gera commits para o seu perfil do GitHub.",
    "tags": ["GitHub", "Next.js", "MongoDB"],
    "href": "https://commitly.audibert.dev/"
  }
]
```

Cada item do array `projects` tem:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | `string` | Sim | Nome do projeto. |
| `description` | `string` | Sim | Descrição curta. Suporta [texto rico](#texto-rico-rich-text). |
| `tags` | `string[]` | Sim (pode ser `[]`) | Tags/tecnologias do projeto. |
| `href` | `string` (URL) | Não | Link do projeto. Se omitido, o card não é clicável. |

> ⚠️ **Limite de exibição:** você pode colocar quantas `tags` quiser, mas **apenas as 3 primeiras** são exibidas no card. As demais ficam só no JSON, sem efeito visual.

Para remover a seção inteira, use `"projects": null`.

---

## `skills`

Lista simples de tecnologias/habilidades, exibida como badges na seção "Habilidades".

```json
"skills": ["Python", "Node.js", "AWS", "SQL", "Git"]
```

É apenas um array de strings — sem limite de itens. Para remover a seção, use `"skills": null`.

---

## `blog`

Liga/desliga a seção de blog na página inicial.

```json
"blog": {
  "enabled": true
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Se `true`, a seção "Blog" aparece na home listando os posts de `src/content/blog/`. Se `false` (ou `"blog": null`), a seção não aparece e os posts não são nem lidos do disco. |

O conteúdo dos posts em si **não** vem do `portfolio.config.json` — veja [Sistema de blog](#sistema-de-blog-srccontentblogmd).

> ⚠️ **Limite de exibição:** cada post pode ter quantas `tags` você quiser no frontmatter, mas **apenas as 3 primeiras** são exibidas (tanto no card da home quanto na página do post).

---

## `discordActivity`

Mostra em tempo real o que você está jogando/ouvindo no Discord, além de um indicador de status (online/ausente/ocupado/offline) ao lado do seu nome.

```json
"discordActivity": {
  "enabled": true,
  "userId": "161092845040566272"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Liga/desliga a seção. |
| `userId` | `string` | Seu ID de usuário do Discord (snowflake). |

Para desativar, use `"enabled": false` (ou `"discordActivity": null`).

A API que fornece os dados (`https://grux.audibert.dev`) e o intervalo de atualização (10 segundos) são fixos neste template, não configuráveis via JSON.

### Formato de API esperado

O site faz `GET https://grux.audibert.dev/activity/{userId}` e espera uma resposta neste formato:

```json
{
  "success": true,
  "data": {
    "status": "online",
    "spotify": {
      "song": "Nome da música",
      "artist": "Nome do artista",
      "album_image": "https://...",
      "link": "https://open.spotify.com/track/..."
    },
    "activity": [
      {
        "type": "Playing",
        "name": "Nome do jogo/app",
        "details": "Detalhe 1",
        "state": "Detalhe 2",
        "largeImage": "https://...",
        "largeText": "Texto alternativo"
      }
    ]
  }
}
```

- `status` aceita `"online"`, `"idle"`, `"dnd"` ou `"offline"` (qualquer outro valor cai no visual de "offline").
- `spotify` é opcional — se ausente, o card de "ouvindo agora" não aparece.
- Apenas itens de `activity` com `"type": "Playing"` são exibidos.
- Essa API é uma integração própria do autor deste template. Se você for usar essa seção no seu fork, verifique se `https://grux.audibert.dev` atende o seu `userId` ou se será necessário hospedar sua própria API compatível com esse formato (por exemplo, a partir da API de presença do Discord/Lanyard).

---

## `credits`

Liga/desliga um pequeno crédito no rodapé do site ("Built with OpenPortfolios"), centralizado e discreto.

```json
"credits": {
  "enabled": true
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Se `true`, mostra o rodapé com o crédito na home e em toda página de post do blog. Se `false` (ou `"credits": null`), nada é exibido. |

---

## `animations`

Liga/desliga a animação de "aparecimento" suave dos elementos da página. Com a animação ativa, o conteúdo já visível ao carregar a página aparece com um fade suave, e o conteúdo mais abaixo só aparece conforme o usuário rola a tela até ele.

```json
"animations": {
  "enabled": true
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Se `true` (padrão), as animações de entrada ficam ativas. Se `false`, todo o conteúdo aparece direto, sem nenhuma animação. |

> A animação respeita a preferência de "reduzir movimento" do sistema operacional do visitante, e nunca é aplicada na visualização de impressão — ela também é restrita a `opacity`/`transform`, então nunca deixa lento nada mais (como a troca de tema claro/escuro).

---

## Texto rico (rich text)

Existem **dois motores de formatação** diferentes neste template, com escopos diferentes de propósito:

1. Os campos de texto do `portfolio.config.json` (`about.text`, `companyDescription`, `bullets`, `description` de projetos) usam um formatador enxuto e propositalmente limitado a uma lista fechada de sintaxes.
2. O **corpo dos posts do blog** (`.md`) usa Markdown/GFM completo, do mesmo jeito que o GitHub renderiza um `README.md`.

### Campos do `portfolio.config.json`

Estes campos aceitam **apenas** a lista abaixo (é a mesma lista de formatação de texto usada pelo GitHub, sem os recursos exclusivos de Issues/Discussions):

| Estilo | Sintaxe | Exemplo | Resultado |
|---|---|---|---|
| Negrito | `** **` ou `__ __` | `**negrito**` | **negrito** |
| Itálico | `* *` ou `_ _` | `*itálico*` | *itálico* |
| Riscado | `~~ ~~` ou `~ ~` | `~~riscado~~` | ~~riscado~~ |
| Negrito com itálico aninhado | `** **` com `_ _` dentro | `**muito _importante_**` | **muito *importante*** |
| Tudo em negrito e itálico | `*** ***` (ou `___ ___`, `**_ _**`, `__* *__`, `_** **_`, `*__ __*`) | `***tudo importante***` | ***tudo importante*** |
| Subscrito | `<sub></sub>` | `H<sub>2</sub>O` | H<sub>2</sub>O |
| Sobrescrito | `<sup></sup>` | `x<sup>2</sup>` | x² |
| Sublinhado | `<ins></ins>` | `<ins>sublinhado</ins>` | <ins>sublinhado</ins> |
| Código | `` ` ` `` | `` `código` `` | `código` |

Além dessa lista, esses campos também suportam **links, com ou sem cor customizada** (recurso próprio deste template, não faz parte da lista acima):

| Sintaxe | Resultado |
|---|---|
| `[texto](url)` | Link clicável, com a cor padrão do tema. |
| `[texto](url){#hex}` | Link clicável, com cor customizada. |
| `[texto](){#hex}` | Texto colorido, **sem** virar link (parênteses vazios). |
| `[texto]{#hex}` | Mesma coisa, sem os parênteses. |

A cor deve ser um código hexadecimal (`#rrggbb` ou `#rrggbbaa` para incluir transparência).

**Exemplo real** (usado na experiência profissional deste projeto, colorindo cada serviço da AWS com a cor oficial da própria AWS):

```
Built full [AWS]{#FF9900} infrastructure ([ECS]{#ED7100}, [S3]{#7AA116}, [RDS]{#C925D1})...
```

Nenhum outro recurso de Markdown (títulos, listas, tabelas, imagens, blocos de código, etc.) funciona nesses campos — eles são textos curtos de uma linha/parágrafo, não um documento inteiro. Para isso, use o corpo de um post do blog.

### Corpo dos posts do blog

O corpo de um post (`src/content/blog/*.md`, depois do frontmatter) roda um Markdown/GFM completo — o objetivo é suportar **tudo que funciona em um `README.md` no GitHub**, excluindo o que só existe dentro de Issues/PRs/Discussions (como notificação de `@menção`, ou a referência automática a `#123` de outro issue/PR, que dependem do GitHub e não fazem sentido fora dele). Isso inclui:

- Títulos `#` a `######` (h1–h6), cada um com um link de âncora automático (ex: `[ir para a seção](#titulo-da-secao)`).
- **Negrito**, *itálico*, ~~riscado~~ (GFM padrão, `~~riscado~~`), `código` e blocos de código com syntax highlighting.
- `<sub>`, `<sup>`, `<ins>` e qualquer outra tag HTML (o Markdown é processado com HTML embutido habilitado).
- Listas numeradas, com marcadores, e **listas de tarefas** (`- [ ]` / `- [x]`).
- Imagens (`![alt](url)`), inclusive imagens diferentes por tema (`<picture>` com `prefers-color-scheme`).
- Citações (`>`).
- Tabelas (GFM).
- Notas de rodapé (`[^1]` ... `[^1]: explicação`).
- Emojis por atalho, ex: `:tada:` → 🎉, `:rocket:` → 🚀, `:+1:` → 👍.
- [Links com cor customizada](#campos-do-portfolioconfigjson) (`{#hex}`), do mesmo jeito que nos campos do JSON — a única extensão não-padrão do Markdown usada aqui.
- Comentários HTML (`<!-- ... -->`) para esconder conteúdo do texto renderizado.
- Escapar formatação com `\` (ex: `\*isso não vira itálico\*`).

> ⚠️ Diferente dos campos do JSON, aqui o riscado é **apenas** `~~riscado~~` (dois tis) — é o padrão oficial do GFM/GitHub. O til simples (`~riscado~`) só é aceito nos campos do `portfolio.config.json`.
>
> Alertas estilo GitHub (`> [!NOTE]` etc.) **não são suportados** — uma citação assim renderiza como uma citação comum, sem estilização especial.

---

## Sistema de blog (`src/content/blog/*.md`)

O blog **não** usa o `portfolio.config.json` (além do liga/desliga em `blog.enabled`). Cada post é um arquivo Markdown dentro de `src/content/blog/`.

### Como publicar um novo post

1. Crie um arquivo `.md` em `src/content/blog/`, por exemplo `src/content/blog/meu-post.md`. O nome do arquivo (sem `.md`) vira a URL do post: `/blog/meu-post`.
2. Preencha o frontmatter no topo do arquivo:

   ```markdown
   ---
   title: "Título do post"
   description: "Descrição curta, usada no card da lista de blog."
   tags: ["Tag1", "Tag2"]
   date: "2026-03-31"
   ---

   Conteúdo do post em Markdown normal a partir daqui.
   ```

3. Salve o arquivo. Não é necessário reiniciar o servidor nem registrar o post em nenhum outro lugar — ele aparece automaticamente na seção "Blog" da home, ordenado por data (mais recente primeiro).

### Campos do frontmatter

| Campo | Tipo | Descrição |
|---|---|---|
| `title` | `string` | Título do post. |
| `description` | `string` | Descrição curta exibida no card da lista de posts. Suporta [texto rico](#texto-rico-rich-text). |
| `tags` | `string[]` | Tags exibidas no card e na página do post. |
| `date` | `string` | Data de publicação. Veja os formatos aceitos abaixo. |

### Formatos de data aceitos

A ordenação "mais recente primeiro" funciona corretamente com qualquer um destes formatos:

| Formato | Exemplo |
|---|---|
| ISO (`AAAA-MM-DD`) — recomendado | `"2026-03-31"` |
| Por extenso em português | `"31 de março de 2026"` |
| Por extenso em inglês | `"March 31, 2026"` |

### Conteúdo do post

O corpo do arquivo (tudo depois do frontmatter) é Markdown/GFM completo. Veja a lista completa de recursos suportados em [Corpo dos posts do blog](#corpo-dos-posts-do-blog).

---

## Rodando o projeto localmente

```bash
npm install       # instala as dependências
npm run dev        # inicia o servidor de desenvolvimento em http://localhost:3000
npm run build       # gera a versão de produção
npm run start       # roda a versão de produção já buildada
```

Depois de qualquer alteração no `portfolio.config.json`, o servidor de desenvolvimento (`npm run dev`) recarrega automaticamente. Alterações em posts do blog (`.md`) também são refletidas sem precisar reiniciar nada.
