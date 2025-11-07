# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Projeto: React-SistemaEducacional (local)

Este workspace contém um exemplo inicial de sistema educacional com rotas e páginas para gerenciar cursos, turmas, estudantes e notas.

O app usa React + TypeScript + Vite. Para rodar localmente:

1. Instale dependências (executar no diretório `react-sistemaeducacional`):

```powershell
npm install
npm install react-router-dom
```

2. Rodar em desenvolvimento:

```powershell
npm run dev
```

3. Para publicar no GitHub crie um repositório chamado `React-SistemaEducacional` e faça push do conteúdo. Exemplo com GitHub CLI:

```powershell
gh repo create React-SistemaEducacional --public --source=. --remote=origin
git push -u origin main
```

Observações:
- As páginas fazem chamadas para a API pública `https://api-estudo-educacao-1.onrender.com/` para obter `students`, `courses`, `classes` e `grades`.
- Se o `react-router-dom` não estiver instalado ou houver diferenças na versão, instale a versão compatível com React + TypeScript.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
