# 🔮 Penseira

> Dashboard pessoal de produtividade — em menção à Penseira do Dumbledore, onde memórias e planos tomam forma.

## Módulos

- **🏠 Visão Geral** — Stats do dia, dicas de produtividade, atalhos rápidos
- **💼 Vagas** — Vagas gerais de TI + análise por currículo via IA (Claude)
- **🖥️ Projetos** — Servidor pessoal, Acqua Monitor, gestão de tarefas
- **📚 Estudos** — Pomodoro timer, revisões por matéria, anotações, Gran Concursos
- **📰 Notícias** — Feed de TI, integração Twitter/X, resumo diário por IA

## Deploy no GitHub Pages

### 1. Fork / Clone este repositório

```bash
git clone https://github.com/SEU_USUARIO/penseira.git
cd penseira
npm install
```

### 2. Configure o nome do repositório no vite.config.js

Abra `vite.config.js` e troque `/penseira/` pelo nome exato do seu repositório:

```js
base: '/nome-do-seu-repo/',
```

### 3. Adicione a API Key da Anthropic

No GitHub, vá em **Settings → Secrets and variables → Actions** e adicione:

- Nome: `VITE_ANTHROPIC_API_KEY`
- Valor: sua chave da Anthropic (começa com `sk-ant-...`)

### 4. Ative o GitHub Pages

Vá em **Settings → Pages** e selecione **Source: GitHub Actions**.

### 5. Faça o primeiro push

```bash
git add .
git commit -m "feat: penseira dashboard"
git push origin main
```

O GitHub Actions vai fazer o build e deploy automaticamente. Seu dashboard estará em:
`https://SEU_USUARIO.github.io/penseira/`

## Desenvolvimento local

```bash
npm run dev
```

## Tecnologias

- React + Vite
- Lucide React (ícones)
- Claude API (Anthropic) para IA de vagas e resumo de notícias
- GitHub Pages + GitHub Actions para deploy gratuito
