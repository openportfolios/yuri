# Documentação `portfolio.config.json`

> [!NOTE]
> Esta é a documentação em português. Uma versão em inglês está a caminho.

Este documento explica **cada campo** do arquivo `portfolio.config.json` (localizado na raiz do projeto) e **como funciona o sistema de blog**. Não é necessário programar para usar nada do que está aqui, tudo é feito editando O `.json` e/ou criando arquivos `.md`.

## Índice

1. [Visão geral](#visão-geral)
2. [Removendo seções](#removendo-seções)
3. [Reordenando seções](#reordenando-seções)
4. [Meta](#meta)
5. [Pessoa](#pessoa)
6. [Sobre](#sobre)
7. [Experiência Profissional](#experiência-profissional)
8. [Formação Acadêmica](#formação-acadêmica)
9. [Projetos](#projetos)
10. [Habilidades](#habilidades)
11. [Certificações](#certificações)
12. [Blog](#blog)
13. [Atividade](#atividade)
14. [Texto rico](#texto-rico-rich-text)
15. [Sistema de blog](#sistema-de-blog-srccontentblogmd)
16. [Rodando o projeto localmente](#rodando-o-projeto-localmente)

## Visão geral

O arquivo `portfolio.config.json` é dividido em blocos, um por seção do site:

```json
{
  "meta": { ... },
  "person": { ... },
  "about": { ... },
  "workExperience": [ ... ],
  "education": [ ... ],
  "projects": [ ... ],
  "skills": [ ... ],
  "certifications": [ ... ],
  "blog": { ... },
  "discordActivity": { ... }
}
```

Os blocos `meta` e `person` são **obrigatórios** (o portfolio não funciona sem eles). Todos os outros blocos (`about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog`, `discordActivity`) são **opcionais**, veja a seção seguinte.

## Removendo seções

Qualquer seção opcional pode ser removida do site colocando `null` no lugar do valor, por exemplo:

```json
"projects": null
```

Isso faz a seção "Projetos" desaparecer completamente da página, sem deixar título vazio, sem espaço em branco. Isso vale para: `about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog` e `discordActivity`.

> [!NOTE]
>  Arrays vazios (`[]`) têm o mesmo efeito de `null` para `workExperience`, `education`, `projects`, `skills` e `certifications`.

## Reordenando seções

As seções da página aparecem **na ordem em que as chaves estão escritas no `portfolio.config.json`**. Para mudar a ordem, basta mover o bloco inteiro de lugar dentro do arquivo. Por exemplo, para exibir "Projetos" antes de "Experiência Profissional":

```json
{
  "meta": { ... },
  "person": { ... },
  "about": { ... },
  "projects": [ ... ],
  "workExperience": [ ... ],
  "education": [ ... ],
  ...
}
```

Isso vale para: `about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog` e `discordActivity`.

> [!NOTE]
> O cabeçalho (`person`) é fixo: ele sempre aparece no topo da página, independentemente da posição dele no arquivo. A chave `meta` não é uma seção e a posição dela no arquivo não muda nada.

## Meta

Configurações gerais do site.

```json
"meta": {
  "siteTitle": "Título da página",
  "siteDescription": "Seu cargo / Título",
  "ogImage": "https://placehold.co/1200x630.png",
  "favicon": "https://github.com/openportfolios.png",
  "defaultTheme": "light",
  "scale": "small",
  "language": "pt",
  "animations": true,
  "credits": true
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `siteTitle` | `string` | Sim | Título da aba do navegador. |
| `siteDescription` | `string` | Sim | Descrição usada nos metadados da página (prévia ao compartilhar o link). |
| `ogImage` | `string` (URL) | Sim | Imagem usada na prévia ao compartilhar o link. |
| `favicon` | `string` (URL) | Não (padrão: `person.avatar`) | Imagem usada como ícone da aba do navegador. |
| `defaultTheme` | `"light"`, `"dark"`, `"system"` | Sim | Tema inicial do site. |
| `scale` | `"small"`, `"medium"`, `"high"` | Não (padrão: `"small"`) | Controla a [escala visual](#escala-visual) do portfolio, tamanho geral de fontes, ícones e espaçamentos. |
| `language` | `"pt"`, `"en"` | Não (padrão: `"en"`) | Idioma dos títulos das seções (Sobre/About, Projetos/Projects, etc.). Não traduz o conteúdo que você mesmo escreve |
| `animations` | `boolean` | Não (padrão: `true`) | Liga/desliga as [animações](#animações) de entrada dos elementos da página. |
| `credits` | `boolean` | Não (padrão: `true`) | Liga/desliga o pequeno crédito "Feito com OpenPortfolios" no [rodapé](#créditos) do site. |

### Escala visual

`meta.scale` tem 3 níveis:

| Valor | Efeito |
|---|---|
| `"small"` | Tamanho padrão (100%), o baseline original do design. |
| `"medium"` | Aumenta fontes, ícones, avatar e espaçamentos em **25%**. |
| `"high"` | Aumenta fontes, ícones, avatar e espaçamentos em **50%**. |

### Animações

`meta.animations` liga/desliga a animação suave dos elementos da página. Com a animação ativa (`true`, o padrão), o conteúdo já visível ao carregar a página aparece com um fade suave, e o conteúdo mais abaixo só aparece conforme o usuário rola a tela até ele. Com `false`, todo o conteúdo aparece direto, sem nenhuma animação.

### Créditos

`meta.credits` liga/desliga um pequeno crédito no rodapé do site "Feito com OpenPortfolios". Se `true` (o padrão), o crédito aparece na home e em toda página de post do blog. Se `false`, nada é exibido.

## Pessoa

Suas informações pessoais e redes sociais, exibidas no cabeçalho do site.

```json
"person": {
  "name": "Seu nome",
  "title": "Seu cargo / Título",
  "location": "Sua cidade, Seu país",
  "avatar": "https://github.com/openportfolios.png",
  "social": [
    {
      "label": "GitHub",
      "href": "https://github.com/openportfolios/yuri",
      "icon": "github"
    }
  ]
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | Sim | Seu nome, exibido em destaque no topo do site. |
| `title` | `string` | Sim | Seu cargo/título. |
| `location` | `string` | Sim | Sua localização. |
| `avatar` | `string` (URL) | Sim | URL da sua foto de perfil. |
| `social` | `array` | Sim (pode ser `[]`) | Lista de redes sociais/links. |

> [!NOTE]
>  O campo `social` suporta até 6 redes.

O projeto tem suporte aos seguintes ícones: GitHub, LinkedIn, Currículo, Instagram, TikTok, X (Twitter), YouTube e Spotify. 

## Sobre

O texto de apresentação, exibido na seção "Sobre".

```json
"about": {
  "text": [
    "Uma breve biografia descrevendo quem você é, o que você faz e o que te motiva profissionalmente. Esta é a sua chance de falar sobre sua trajetória, paixões e foco atual.",
    "Você também pode usar [texto colorido]{#8D62DD} e [links](https://github.com/openportfolios/yuri){#0EA5E9} na sua biografia."
  ]
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `text` | `string` ou `string[]` | O texto da bio. Use uma `string` para um único parágrafo, ou um array de strings para múltiplos parágrafos. |

Suporta [texto rico](#texto-rico-rich-text) completo.

Exemplo com um único parágrafos:

```json
"about": {
  "text": "Único parágrafo da bio."
}
```

## Experiência Profissional

Lista das suas experiências profissionais, exibida na seção "Experiência Profissional".

```json
"workExperience": [
  {
    "company": "Nome da Empresa",
    "companyUrl": "https://www.company.com",
    "companyImage": "https://placehold.co/1366x768.png",
    "companyDescription": "Uma breve descrição da empresa, o que ela faz e sua missão.",
    "role": "Cargo",
    "period": "Mês Ano - Presente",
    "tags": [
      "Remoto",
      "Habilidade 1",
      "Habilidade 2"
    ],
    "bullets": [
      "Pelo que você era responsável neste emprego.",
      "Projeto ou sistema específico que você construiu ou para o qual contribuiu.",
      "Impacto que você teve, como melhorar o desempenho, economizar tempo ou resolver um problema.",
      "Qualquer outra informação que você ache relevante para mostrar suas habilidades e experiência."
    ]
  }
]
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `company` | `string` | Sim | Nome da empresa. |
| `companyUrl` | `string` (URL) | Sim | Link do site da empresa (o nome da empresa vira um link para essa URL). |
| `companyImage` | `string` (URL) | Não | Imagem exibida num preview flutuante ao passar o mouse sobre o nome da empresa. Se omitido, nenhum preview é exibido. 
| `companyDescription` | `string` | Não | Uma frase curta descrevendo a empresa. Suporta [texto rico](#texto-rico-rich-text). |
| `role` | `string` | Sim | Seu cargo na empresa. |
| `period` | `string` | Sim | Período trabalhado (texto livre, ex: `"Setembro 2025 - Presente"`). |
| `tags` | `string[]` | Sim (pode ser `[]`) | Tags exibidas ao lado do nome da empresa (ex: modalidade, tecnologias). |
| `bullets` | `string[]` | Sim (pode ser `[]`) | Lista de realizações/responsabilidades, exibida como bullet points. Cada item suporta [texto rico](#texto-rico-rich-text). |

> [!NOTE]
>  O campo `tags` suporta até 6 tags.

## Formação Acadêmica

Lista da sua formação acadêmica, exibida na seção "Formação Acadêmica" (abaixo da Experiência Profissional).

```json
"education": [
  {
    "institution": "Nome da Universidade",
    "degree": "Bacharelado em Ciência da Computação",
    "period": "Set 2025 - Presente"
  }
]
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `institution` | `string` | Sim | Nome da instituição de ensino. |
| `degree` | `string` | Sim | Curso/grau (ex: `"Bacharelado em Ciência da Computação"`). |
| `period` | `string` | Sim | Período (texto livre, ex: `"Set 2025 - Presente"`). |

## Projetos

Lista dos seus projetos, exibida na seção "Projetos" como cards.

```json
"projects": [
  {
    "title": "Nome do projeto",
    "description": "O que é o projeto e o que ele faz.",
    "tags": [
      "Tecnologia 1",
      "Tecnologia 2"
    ],
    "href": "https://github.com/openportfolios/yuri"
  }
]
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | `string` | Sim | Nome do projeto. |
| `description` | `string` | Sim | Descrição curta. Suporta [texto rico](#texto-rico-rich-text). |
| `tags` | `string[]` | Sim (pode ser `[]`) | Tags do projeto como, tecnologias utilizadas. |
| `href` | `string` (URL) | Não | Link do projeto. Se omitido, o card não é clicável. |

> [!NOTE]
>  O campo `tags` suporta até 3 tags.

## Habilidades

Lista simples de tecnologias/habilidades, exibida como badges na seção "Habilidades".

```json
"skills": ["Python", "Node.js", "AWS", "SQL", "Git"]
```

É apenas um array de strings, sem limite de itens.

## Certificações

Lista das suas certificações, exibida na seção "Certificações".

```json
"certifications": [
 {
      "title": "Nome da Certificação",
      "issuer": "Nome da Instituição",
      "certificationImage": "https://placehold.co/600x600",
      "date": "Mês Ano",
      "href": "https://github.com/openportfolios/yuri"
    }
]
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | `string` | Sim | Nome da certificação. |
| `issuer` | `string` | Sim | Instituição emissora (ex: `"Amazon Web Services"`). |
| `certificationImage` | `string` (URL) | Não | Imagem/badge da certificação, exibida ao lado do título. Se omitido, o card mostra só o texto. |
| `date` | `string` | Sim | Data de emissão (texto livre, ex: `"Março 2025"`). |
| `href` | `string` (URL) | Não | Link da credencial. Se presente, o card inteiro vira clicável (abre em nova aba). Se omitido, o card não é clicável. |

## Blog

Liga/desliga a seção de blog na página inicial.

```json
"blog": {
  "enabled": true
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Se `true`, a seção "Blog" aparece na home listando os posts de `src/content/blog/`. Se `false`, a seção não aparece. |

> [!NOTE]
>  O campo `tags` suporta até 3 tags.

O conteúdo dos posts em si **não** vem do `portfolio.config.json`. Para criar blogs veja o [sistema de blog](#sistema-de-blog-srccontentblogmd).

## Atividade

Mostra em tempo real o que você está jogando/ouvindo no Discord, além de um indicador de status (online/ausente/ocupado/offline) ao lado do seu nome.

```json
"discordActivity": {
  "enabled": true,
  "userId": "Seu ID de usuário do Discord"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `enabled` | `boolean` | Liga/desliga a seção. |
| `userId` | `string` | Seu ID de usuário do Discord. |

A API que fornece os dados do Discord é a [Grux API](https://github.com/matheusaudibert/grux) e para ela funcionar você deve ser membro deste servidor:

[![Discord Server Card](https://cardzera.audibert.dev/api/1383718526694461532?t=1783293948510&buttonText=Entrar)](https://discord.gg/XuhsaMEqzf)

## Texto rico (rich text)

Existem **dois motores de formatação** diferentes neste template, com escopos diferentes de propósito:

1. Os campos de texto do `portfolio.config.json` (`about.text`, `companyDescription`, `bullets`, `description` de projetos) usam um formatador enxuto e propositalmente limitado a uma lista fechada de sintaxes.
2. O **corpo dos posts do blog** (`.md`) usa Markdown completo, do mesmo jeito que o GitHub renderiza um `README.md`.

### Campos do `portfolio.config.json`

Estes campos aceitam **apenas** a lista abaixo (é a mesma lista de formatação de texto usada pelo GitHub, sem os recursos exclusivos de Issues/Discussions):

| Estilo | Sintaxe | Exemplo | Resultado |
|---|---|---|---|
| Negrito | `** **` ou `__ __` | `**negrito**` | **negrito** |
| Itálico | `* *` ou `_ _` | `*itálico*` | *itálico* |
| Riscado | `~~ ~~` ou `~ ~` | `~~riscado~~` | ~~riscado~~ |
| Subscrito | `<sub></sub>` | `<sub>subscrito</sub>` | <sub>subscrito</sub> |
| Sobrescrito | `<sup></sup>` | `<sup>sobrescrito</sup>` | <sup>sobrescrito</sup> |
| Sublinhado | `<ins></ins>` | `<ins>sublinhado</ins>` | <ins>sublinhado</ins> |
| Código | `` ` ` `` | `` `código` `` | `código` |

Além dessa lista, esses campos também suportam **links, com ou sem cor customizada** (recurso próprio deste template, não faz parte da lista acima):

| Sintaxe | Resultado |
|---|---|
| `[texto](url)` | Link clicável, com a cor padrão do tema. |
| `[texto](url){#hex}` | Link clicável, com cor customizada. |
| `[texto]{#hex}` | Apenas cor customizada. |

A cor deve ser um código hexadecimal (`#rrggbb` ou `#rrggbbaa` para incluir transparência).

### Corpo dos posts do blog

O corpo de um post (`src/content/blog/*.md`) roda um Markdown completo, isso inclui:

- Títulos `#` a `######` (h1–h6).
- **Negrito**, *itálico*, ~~riscado~~, `código`, `<sub>`, `<sup>`, `<ins>`.
- Listas numeradas, com marcadores, e listas de tarefas (`- [ ]` / `- [x]`).
- Imagens (`![alt](url)` ou `<img src="url" width="x" />`
- Citações (`>`).
- Notas de rodapé (`[^1]` ... `[^1]: explicação`).
- Emojis por atalho, ex: `:tada:` (🎉), `:rocket:` (🚀), `:+1:` (👍).
- Cores customizada (`{#hex}`).
- Comentários HTML (`<!-- ... -->`) para esconder conteúdo do texto renderizado.
- Escapar formatação com `\` (ex: `\*isso não vira itálico\*`).

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

3. Salve o arquivo. Não é necessário reiniciar o servidor nem registrar o post em nenhum outro lugar, ele aparece automaticamente na seção "Blog" da home, ordenado por data (mais recente primeiro).

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
| ISO (`AAAA-MM-DD`) recomendado | `"2026-03-31"` |
| Por extenso em português | `"31 de março de 2026"` |

### Conteúdo do post

O corpo do arquivo (tudo depois do frontmatter) é Markdown completo. Veja a lista completa de recursos suportados em [Corpo dos posts do blog](#corpo-dos-posts-do-blog).

## Rodando o projeto localmente

```bash
npm install       # instala as dependências
npm run dev        # inicia o servidor de desenvolvimento em http://localhost:3000
npm run build       # gera a versão de produção
npm run start       # roda a versão de produção já buildada
```

Depois de qualquer alteração no `portfolio.config.json`, o servidor de desenvolvimento (`npm run dev`) recarrega automaticamente. Alterações em posts do blog (`.md`) também são refletidas sem precisar reiniciar nada.