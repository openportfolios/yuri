# `portfolio.config.json` documentation

> [!NOTE]
> This is the English documentation. For the Portuguese version, click [here](DOCUMENTACAO.md).

This document explains **every field** of the `portfolio.config.json` file (located at the root of the project) and **how the blog system works**. No programming is required for anything described here, everything is done by editing the `.json` and/or creating `.md` files.

## Table of contents

1. [Overview](#overview)
2. [Removing sections](#removing-sections)
3. [Reordering sections](#reordering-sections)
4. [Meta](#meta)
5. [Person](#person)
6. [About](#about)
7. [Work experience](#work-experience)
8. [Education](#education)
9. [Projects](#projects)
10. [Skills](#skills)
11. [Certifications](#certifications)
12. [Blog](#blog)
13. [Activity](#activity)
14. [Rich text](#rich-text)
15. [Blog system](#blog-system-srccontentblogmd)
16. [Running the project locally](#running-the-project-locally)

## Overview

The `portfolio.config.json` file is split into blocks, one per section of the site:

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

The `meta` and `person` blocks are **required** (the portfolio does not work without them). Every other block (`about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog`, `discordActivity`) is **optional**, see the next section.

## Removing sections

Any optional section can be removed from the site by setting its value to `null`, for example:

```json
"projects": null
```

This makes the "Projects" section disappear from the page entirely, with no empty heading and no blank space left behind. This applies to: `about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog` and `discordActivity`.

> [!NOTE]
>  Empty arrays (`[]`) have the same effect as `null` for `workExperience`, `education`, `projects`, `skills` and `certifications`.

## Reordering sections

The sections of the page appear **in the order the keys are written in `portfolio.config.json`**. To change the order, just move the whole block to a different place in the file. For example, to show "Projects" before "Work experience":

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

This applies to: `about`, `workExperience`, `education`, `projects`, `skills`, `certifications`, `blog` and `discordActivity`.

> [!NOTE]
> The header (`person`) is fixed: it always appears at the top of the page, regardless of its position in the file. The `meta` key is not a section and its position in the file changes nothing.

## Meta

General site settings.

```json
"meta": {
  "siteTitle": "Page title",
  "siteDescription": "Your role / Title",
  "ogImage": "https://placehold.co/1200x630.png",
  "favicon": "https://github.com/openportfolios.png",
  "defaultTheme": "light",
  "scale": "small",
  "language": "en",
  "animations": true,
  "credits": true
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `siteTitle` | `string` | Yes | Browser tab title. |
| `siteDescription` | `string` | Yes | Description used in the page metadata (link sharing preview). |
| `ogImage` | `string` (URL) | Yes | Image used in the link sharing preview. |
| `favicon` | `string` (URL) | No (default: `person.avatar`) | Image used as the browser tab icon. |
| `defaultTheme` | `"light"`, `"dark"`, `"system"` | Yes | Initial theme of the site. |
| `scale` | `"small"`, `"medium"`, `"high"` | No (default: `"small"`) | Controls the [visual scale](#visual-scale) of the portfolio, the overall size of fonts, icons and spacing. |
| `language` | `"pt"`, `"en"` | No (default: `"en"`) | Language of the section titles (Sobre/About, Projetos/Projects, etc.). It does not translate the content you write yourself. |
| `animations` | `boolean` | No (default: `true`) | Turns the entrance [animations](#animations) of the page elements on/off. |
| `credits` | `boolean` | No (default: `true`) | Turns the small "Made with OpenPortfolios" [credit](#credits) in the site footer on/off. |

### Visual scale

`meta.scale` has 3 levels:

| Value | Effect |
|---|---|
| `"small"` | Default size (100%), the original design baseline. |
| `"medium"` | Increases fonts, icons, avatar and spacing by **25%**. |
| `"high"` | Increases fonts, icons, avatar and spacing by **50%**. |

### Animations

`meta.animations` turns the smooth animation of the page elements on/off. With the animation enabled (`true`, the default), the content already visible when the page loads appears with a soft fade, and the content further down only appears as the user scrolls to it. With `false`, all the content appears right away, with no animation at all.

### Credits

`meta.credits` turns a small "Made with OpenPortfolios" credit in the site footer on/off. If `true` (the default), the credit appears on the home page and on every blog post page. If `false`, nothing is shown.

## Person

Your personal information and social links, shown in the site header.

```json
"person": {
  "name": "Your name",
  "title": "Your role / Title",
  "location": "Your city, Your country",
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

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Your name, prominently displayed at the top of the site. |
| `title` | `string` | Yes | Your role/title. |
| `location` | `string` | Yes | Your location. |
| `avatar` | `string` (URL) | Yes | URL of your profile picture. |
| `social` | `array` | Yes (can be `[]`) | List of social networks/links. |

> [!NOTE]
>  The `social` field supports up to 6 networks.

The project ships with icons for: Email, Resume, GitHub, LinkedIn, Instagram, X (Twitter) and YouTube.

## About

The introduction text, shown in the "About" section.

```json
"about": {
  "text": [
    "A short bio describing who you are, what you do and what drives you professionally. This is your chance to talk about your background, passions and current focus.",
    "You can also use [colored text]{#8D62DD} and [links](https://github.com/openportfolios/yuri){#0EA5E9} in your bio."
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `text` | `string` or `string[]` | The bio text. Use a `string` for a single paragraph, or an array of strings for multiple paragraphs. |

Supports full [rich text](#rich-text).

Example with a single paragraph:

```json
"about": {
  "text": "Single bio paragraph."
}
```

## Work experience

The list of your professional experience, shown in the "Work experience" section.

```json
"workExperience": [
  {
    "company": "Company Name",
    "companyUrl": "https://www.company.com",
    "companyImage": "https://placehold.co/1366x768.png",
    "companyDescription": "A short description of the company, what it does and its mission.",
    "role": "Role",
    "period": "Month Year - Present",
    "tags": [
      "Remote",
      "Skill 1",
      "Skill 2"
    ],
    "bullets": [
      "What you were responsible for in this job.",
      "A specific project or system you built or contributed to.",
      "The impact you had, such as improving performance, saving time or solving a problem.",
      "Any other information you find relevant to show your skills and experience."
    ]
  }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `company` | `string` | Yes | Company name. |
| `companyUrl` | `string` (URL) | Yes | Link to the company website (the company name becomes a link to this URL). |
| `companyImage` | `string` (URL) | No | Image shown in a floating preview when hovering over the company name. If omitted, no preview is shown. |
| `companyDescription` | `string` | No | A short sentence describing the company. Supports [rich text](#rich-text). |
| `role` | `string` | Yes | Your role at the company. |
| `period` | `string` | Yes | Period worked (free text, e.g. `"September 2025 - Present"`). |
| `tags` | `string[]` | Yes (can be `[]`) | Tags shown next to the company name (e.g. work model, technologies). |
| `bullets` | `string[]` | Yes (can be `[]`) | List of achievements/responsibilities, shown as bullet points. Each item supports [rich text](#rich-text). |

> [!NOTE]
>  The `tags` field supports up to 5 tags.

## Education

The list of your academic background, shown in the "Education" section (below Work experience).

```json
"education": [
  {
    "institution": "University Name",
    "degree": "Bachelor's Degree in Computer Science",
    "period": "Month Year - Present"
  }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `institution` | `string` | Yes | Name of the educational institution. |
| `degree` | `string` | Yes | Course/degree (e.g. `"Bachelor's Degree in Computer Science"`). |
| `period` | `string` | Yes | Period (free text, e.g. `"Month Year - Present"`). |

## Projects

The list of your projects, shown as cards in the "Projects" section.

```json
"projects": [
  {
    "title": "Project name",
    "description": "What the project is and what it does.",
    "tags": [
      "Technology 1",
      "Technology 2"
    ],
    "href": "https://github.com/openportfolios/yuri"
  }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Project name. |
| `description` | `string` | Yes | Short description. Supports [rich text](#rich-text). |
| `tags` | `string[]` | Yes (can be `[]`) | Project tags, such as the technologies used. |
| `href` | `string` (URL) | No | Link to the project. If omitted, the card is not clickable. |

> [!NOTE]
>  The `tags` field supports up to 3 tags.

> [!TIP]
>  When `href` points to a GitHub repository (e.g. `https://github.com/user/repo`), the repository's star count appears on the same line as the tags, aligned to the right of the card. The count is fetched from the public GitHub API by the browser; if the repository is private or the API does not respond, nothing is shown.

## Skills

A simple list of technologies/skills, shown as badges in the "Skills" section.

```json
"skills": ["Python", "Node.js", "AWS", "SQL", "Git"]
```

It is just an array of strings, with no item limit.

## Certifications

The list of your certifications, shown in the "Certifications" section.

```json
"certifications": [
 {
      "title": "Certification Name",
      "issuer": "Institution Name",
      "certificationImage": "https://placehold.co/600x600",
      "date": "Month Year",
      "href": "https://github.com/openportfolios/yuri"
    }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Certification name. |
| `issuer` | `string` | Yes | Issuing institution (e.g. `"Amazon Web Services"`). |
| `certificationImage` | `string` (URL) | No | Certification image/badge, shown next to the title. If omitted, the card shows text only. |
| `date` | `string` | Yes | Issue date (free text, e.g. `"March 2025"`). |
| `href` | `string` (URL) | No | Link to the credential. If present, the whole card becomes clickable (opens in a new tab). If omitted, the card is not clickable. |

## Blog

Turns the blog section on the home page on/off.

```json
"blog": {
  "enabled": true
}
```

| Field | Type | Description |
|---|---|---|
| `enabled` | `boolean` | If `true`, the "Blog" section appears on the home page listing the posts from `src/content/blog/`. If `false`, the section does not appear. |

> [!NOTE]
>  The `tags` field supports up to 3 tags.

The content of the posts themselves does **not** come from `portfolio.config.json`. To create posts see the [blog system](#blog-system-srccontentblogmd).

## Activity

Shows in real time what you are playing/listening to on Discord, plus a status indicator (online/idle/do not disturb/offline) next to your name.

```json
"discordActivity": {
  "enabled": true,
  "userId": "Your Discord user ID"
}
```

| Field | Type | Description |
|---|---|---|
| `enabled` | `boolean` | Turns the section on/off. |
| `userId` | `string` | Your Discord user ID. |

The API that provides the Discord data is the [Grux API](https://github.com/matheusaudibert/grux), and for it to work you must be a member of this server:

[![Discord Server Card](https://cardzera.audibert.dev/api/1383718526694461532?t=1783293948510&buttonText=Join)](https://discord.gg/XuhsaMEqzf)

## Rich text

There are **two different formatting engines** in this template, with different scopes and purposes:

1. The text fields of `portfolio.config.json` (`about.text`, `companyDescription`, `bullets`, project `description`) use a lean formatter, deliberately limited to a closed list of syntaxes.
2. The **body of blog posts** (`.md`) uses full Markdown, the same way GitHub renders a `README.md`.

### `portfolio.config.json` fields

These fields accept **only** the list below (it is the same text formatting list used by GitHub, without the features exclusive to Issues/Discussions):

| Style | Syntax | Example | Result |
|---|---|---|---|
| Bold | `** **` or `__ __` | `**bold**` | **bold** |
| Italic | `* *` or `_ _` | `*italic*` | *italic* |
| Strikethrough | `~~ ~~` or `~ ~` | `~~strikethrough~~` | ~~strikethrough~~ |
| Subscript | `<sub></sub>` | `<sub>subscript</sub>` | <sub>subscript</sub> |
| Superscript | `<sup></sup>` | `<sup>superscript</sup>` | <sup>superscript</sup> |
| Underline | `<ins></ins>` | `<ins>underline</ins>` | <ins>underline</ins> |
| Code | `` ` ` `` | `` `code` `` | `code` |

Beyond that list, these fields also support **links, with or without a custom color** (a feature of this template, not part of the list above):

| Syntax | Result |
|---|---|
| `[text](url)` | Clickable link, with the default theme color. |
| `[text](url){#hex}` | Clickable link, with a custom color. |
| `[text]{#hex}` | Custom color only. |

The color must be a hexadecimal code (`#rrggbb`, or `#rrggbbaa` to include transparency).

### Blog post body

The body of a post (`src/content/blog/*.md`) runs full Markdown, which includes:

- Headings `#` to `######` (h1–h6).
- **Bold**, *italic*, ~~strikethrough~~, `code`, `<sub>`, `<sup>`, `<ins>`.
- Ordered lists, bulleted lists, and task lists (`- [ ]` / `- [x]`).
- Images (`![alt](url)` or `<img src="url" width="x" />`).
- Blockquotes (`>`).
- Footnotes (`[^1]` ... `[^1]: explanation`).
- Emoji shortcodes, e.g. `:tada:` (🎉), `:rocket:` (🚀), `:+1:` (👍).
- Custom colors (`{#hex}`).
- HTML comments (`<!-- ... -->`) to hide content from the rendered text.
- Escaping formatting with `\` (e.g. `\*this does not become italic\*`).

## Blog system (`src/content/blog/*.md`)

The blog does **not** use `portfolio.config.json` (beyond the on/off switch in `blog.enabled`). Each post is a Markdown file inside `src/content/blog/`.

### Publishing a new post

1. Create a `.md` file in `src/content/blog/`, for example `src/content/blog/my-post.md`. The file name (without `.md`) becomes the post URL: `/blog/my-post`.
2. Fill in the frontmatter at the top of the file:

   ```markdown
   ---
   title: "Post title"
   description: "Short description, used on the card in the blog list."
   tags: ["Tag1", "Tag2"]
   date: "2026-03-31"
   ---

   Post content in regular Markdown from here on.
   ```

3. Save the file. There is no need to restart the server or register the post anywhere else, it shows up automatically in the "Blog" section of the home page, sorted by date (most recent first).

### Frontmatter fields

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Post title. |
| `description` | `string` | Short description shown on the card in the post list. Supports [rich text](#rich-text). |
| `tags` | `string[]` | Tags shown on the card and on the post page. |
| `date` | `string` | Publication date. See the accepted formats below. |

### Accepted date formats

The "most recent first" sorting works correctly with any of these formats:

| Format | Example |
|---|---|
| ISO (`YYYY-MM-DD`), recommended | `"2026-03-31"` |
| Long form in Portuguese | `"31 de março de 2026"` |
| Long form in English | `"March 31, 2026"` |

### Post content

The body of the file (everything after the frontmatter) is full Markdown. See the complete list of supported features in [Blog post body](#blog-post-body).