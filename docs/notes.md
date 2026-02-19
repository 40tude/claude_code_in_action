https://anthropic.skilljar.com/claude-code-in-action

npm run dev
On voit la port localhost:3000
C'est très lent




## MCP playright
Sous windows ce qui est précisé ne fonctionne pas

```powershell
claude mcp remove playwright
claude mcp add --transport stdio playwright -- cmd /c npx @playwright/mcp@latest
```

Voir `.claude\settings.local.json`
```json
{
    "permissions": {
        "allow": [
            "Bash(npm test:*)",
            "Bash(npm run lint:*)",
            "mcp__playwright"
        ]
    }
}
```

Voir : `src\lib\prompts\generation.tsx`


## GitHub Integration
```text
/install-github-app

```
Faut mettre le repo sur GitHub
Faut installer https://github.com/apps/claude