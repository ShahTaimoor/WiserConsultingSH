// Ambient declaration for plain (non-module) CSS side-effect imports, e.g. `import "./globals.css"`.
// Next.js's own next-env.d.ts only declares `*.module.css`, so editors that flag TS2882
// ("Cannot find module or type declarations for side-effect import") need this too.
declare module "*.css";
