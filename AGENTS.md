# StoryModEngine website

- Preserve the existing TanStack Start routes, SSR, download flow and documentation system.
- Documentation lives in `src/content/docs/<version>/<section>/<page>.mdx`, loaded by `src/lib/docs.ts` via `import.meta.glob`. Adding a file adds a page without changing routing code.
- Use only authentic product captures from `public/product/` and `src/assets/docs/screenshots/`.
- Do not edit generated files such as `src/routeTree.gen.ts` by hand.
- Use npm with the committed `package-lock.json` and Node.js 24.
- `npm run build` generates the Vercel deployment in `.vercel/output`. `npm run build:node` generates a local Node server in `.output`.
- Do not rewrite published Git history or commit secrets.
