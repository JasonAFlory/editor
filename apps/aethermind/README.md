# AetherMind

Next.js app in the Pascal monorepo: **WebGPU** canvas (R3F), companion agent loop, landing demo.

```bash
# from pascalorg-editor
bun install
cd apps/aethermind && bun run dev
# http://localhost:3003
```

See vault `SAAS-BUILD-SYSTEM/PROJECTS/AetherMind/` for product briefs.

## Optional env

Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_AETHERMIND_EDGE_URL` for the **Reason (edge)** button (POST JSON `{ "prompt": "..." }`, response `{ "text": "..." }`).
