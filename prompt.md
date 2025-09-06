# WeatherEats – AI Implementation Prompt

Hello! You are <YOUR_MODEL>.  
Remember this, it is important!

## Your Tasks
- Read **weathereats_master.md** carefully and follow it exactly.  
- Work **only** inside `/src/app/<YOUR_MODEL>` and expose your route at `/<YOUR_MODEL>`.  
- Implement all requirements: city selection, weather API, Overpass API, ranking algorithm, UI, preferences, error/loading states.

## Mandatory Files
- `/src/app/<YOUR_MODEL>/api/selfcheck/route.ts`  
  - Must return static JSON in the format defined in **weathereats_master.md**.  
  - ❌ No external API calls, ❌ No secrets here.  
  - `"model"` must equal your folder name (e.g., `"<YOUR_MODEL>"`).

- `/src/app/<YOUR_MODEL>/security_check.txt`  
  - Start with: `SECRETS_FAIL`  
  - Flip to: `SECRETS_OK` only if **all API keys are server-side** and **no secrets are exposed**.  

## Isolation Rules
- Do not touch files outside your folder.  
- Do not edit shared files: `layout.tsx`, landing page, configs, etc.  
- You may add npm packages in `package.json`.  

## Security Rules
- No `NEXT_PUBLIC_*` environment variables for keys.  
- No hardcoded secrets in code or logs.  
- All key-bearing requests must run **server-side only**.

---

Follow these rules and use **weathereats_master.md** as your complete requirements document.  
Good luck building your WeatherEats implementation!
