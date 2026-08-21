# Deploy (Vercel)

Siga o tutorial abaixo para colocar o seu portfolio no ar de graça, com HTTPS e domínio próprio da Vercel (`seu-portfolio.vercel.app`). Não é necessário cartão de crédito e nada aqui exige programação.

## Índice

1. [Antes de começar](#antes-de-começar)
2. [Passo a passo](#passo-a-passo)
3. [Atualizando o site](#atualizando-o-site)
4. [Domínio personalizado](#domínio-personalizado)

## Antes de começar

Você vai precisar de:

- Uma conta no **GitHub** com o seu repositório do portfolio já criado (veja "Como usar" no [README](README.md)).
- Uma conta na **Vercel**, crie em [vercel.com/signup](https://vercel.com/signup). Escolha **"Continue with GitHub"**, assim as duas contas já ficam conectadas.

## Passo a passo

### 1. Importar o repositório

1. Acesse [vercel.com/new](https://vercel.com/new).
2. Na lista **"Import Git Repository"**, encontre o repositório do seu portfolio e clique em **"Import"**.
3. Se o repositório não aparecer, clique em **"Adjust GitHub App Permissions"** e libere o acesso a ele.

### 2. Configurar o projeto

A Vercel detecta o Next.js sozinha e já preenche tudo. Confira se está assim e **não mude nada**:

| Campo | Valor |
|---|---|
| Framework Preset | `Next.js` |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | (vazio / padrão) |
| Install Command | `npm install` |

### 3. Publicar

Clique em **"Deploy"** e aguarde. O primeiro build leva entre 1 e 3 minutos.

Ao terminar, a Vercel mostra uma prévia do site e a URL pública, no formato `https://nome-do-projeto.vercel.app`. O HTTPS já vem configurado e é renovado automaticamente.

Pronto, o seu portfolio está no ar.

## Atualizando o site

Depois do primeiro deploy, **todo `push` na branch `main` gera um novo deploy automaticamente**. Não é preciso mexer na Vercel de novo.

Isso vale para qualquer alteração:

- Editar o `portfolio.config.json`.
- Adicionar ou editar um post do blog em `src/content/blog/`.

```bash
git add .
git commit -m "atualiza portfolio"
git push
```

Em cerca de um minuto o site já está atualizado.

## Domínio personalizado

Conectar um domínio próprio é **gratuito** no plano Hobby (você paga apenas pelo domínio no registrador, como Registro.br, Namecheap ou Cloudflare).

1. No painel do projeto, vá em **Settings → Domains**.
2. Digite o seu domínio (ex: `seunome.com.br`) e clique em **"Add"**.
3. A Vercel mostra os registros de DNS que você precisa criar no seu registrador. Normalmente:
   - Um registro **A** para o domínio raiz, apontando para o IP informado pela Vercel.
   - Um registro **CNAME** para o `www`, apontando para o host informado pela Vercel.
4. Crie esses registros no painel do seu registrador e volte para a Vercel.

A propagação do DNS pode levar de alguns minutos até algumas horas. Quando concluir, a Vercel emite o certificado HTTPS automaticamente.