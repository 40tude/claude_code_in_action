# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup      # install deps, generate Prisma client, run migrations
npm run dev        # start dev server (Turbopack) on localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm test           # vitest (jsdom env)
npm test -- <file> # run single test file
npm run db:reset   # reset database (destructive)
```

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in chat, Claude generates code via tools, and components render in a sandboxed iframe.

### Core Flow

1. **Chat API** (`src/app/api/chat/route.ts`) - Streaming endpoint using Vercel AI SDK with two tools:
   - `str_replace_editor` - create/edit files (view, create, str_replace, insert commands)
   - `file_manager` - rename/delete files

2. **Virtual File System** (`src/lib/file-system.ts`) - In-memory file tree, no disk writes. Serializes to JSON for persistence in DB.

3. **Preview Pipeline** (`src/lib/transform/jsx-transformer.ts` + `PreviewFrame.tsx`):
   - Babel transforms JSX/TSX to JS
   - Creates blob URLs for each file
   - Generates import map (local files + esm.sh for npm packages)
   - Renders in sandboxed iframe with Tailwind CDN

### Context Providers

- `FileSystemProvider` - wraps VirtualFileSystem, handles tool call side effects
- `ChatProvider` - wraps useChat from @ai-sdk/react, syncs with file system

### Tool Implementations

- `src/lib/tools/str-replace.ts` - str_replace_editor tool logic
- `src/lib/tools/file-manager.ts` - file_manager tool logic

### Key Files

- `src/lib/provider.ts` - LLM provider config; model is `claude-haiku-4-5`, falls back to `MockLanguageModel` when no API key (generates static demo components)
- `src/lib/auth.ts` - JWT session management (jose), 7-day expiry, cookie `auth-token`
- `src/lib/prompts/generation.tsx` - system prompt; tells Claude to use /App.jsx as entry point with Tailwind + @/ alias
- `prisma/schema.prisma` - database schema (SQLite); always reference this file to understand data structure
- `src/middleware.ts` - route middleware
- `src/actions/` - server actions for project CRUD

### Preview Entry Point Resolution

`PreviewFrame.tsx` tries in order: /App.jsx, /App.tsx, /index.jsx, /index.tsx, /src/App.jsx, /src/App.tsx, then falls back to first .jsx/.tsx file found.

### Path Aliases

`@/*` maps to `./src/*`

## Environment Variables

- `ANTHROPIC_API_KEY` - optional; without it the app uses a mock provider
- `JWT_SECRET` - optional; defaults to `"development-secret-key"`

## Code Style

- No emoji in source code or comments
- All code, comments, and documentation in US English (regardless of instruction language)
- Use comments sparingly; only comment complex code
- No en-dash or em-dash in comments or documentation
