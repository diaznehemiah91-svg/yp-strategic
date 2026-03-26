# /check-prompts

Audit all AI prompts in the codebase for quality and consistency.

## Usage
```
/check-prompts
```

## What this does

Reviews every prompt in `app/lib/prompts.ts` and any inline prompts in API routes or components, then reports:

1. **Coverage** — which features have prompts vs. are using inline strings
2. **Quality issues** — vague instructions, missing output format specs, no fallback handling
3. **Consistency** — whether persona/tone is uniform across prompts
4. **Missing prompts** — features that need AI but have no prompt defined

## Instructions

Read the following files:
- `app/lib/prompts.ts`
- `app/lib/agents.ts`
- `app/api/analyze/route.ts`
- `app/api/forge/generate/route.ts`
- `app/lib/terminal-commands.ts`

For each prompt found, evaluate:
- Does it have a clear persona / system context?
- Does it specify the exact output format (JSON schema, markdown sections, plain text)?
- Does it handle the mock/fallback case?
- Is the max_tokens allocation appropriate for the expected output length?

Output a markdown table with columns: **File | Prompt | Status | Issues**.

Then list 3–5 concrete improvement suggestions ranked by impact.
