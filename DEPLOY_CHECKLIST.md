# Deploy to Vercel — Quick Checklist

## ✅ STEP 1: Go Live (Takes 2 minutes)

```
1. Open https://vercel.com/new
2. Click "Import Git Repository"  
3. Paste: https://github.com/diaznehemiah91-svg/yp-strategic
4. Click "Import"
```

---

## ✅ STEP 2: Add API Keys (Takes 3 minutes)

When Vercel shows "Environment Variables" section, add these:

| Key | Value | Where to Get |
|-----|-------|--------------|
| `FINNHUB_KEY` | your_key_here | https://finnhub.io/register |
| `ANTHROPIC_API_KEY` | your_key_here | https://console.anthropic.com |
| `NEXT_PUBLIC_APP_URL` | https://ypstrategicresearch.com | (just copy) |
| `NODE_ENV` | production | (just copy) |

**Optional:** Add `COINMARKETCAP_API_KEY`, `NEWSAPI_KEY`, `FRED_API_KEY` later

---

## ✅ STEP 3: Deploy

```
1. Scroll down and click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Click "Visit" button when done
```

**You're live!** 🎉

---

## ✅ VERIFY IT WORKS

- [ ] Homepage loads with 3D background
- [ ] Search bar appears (⌘K or search icon)
- [ ] Click on any ticker → navigates to full market data page
- [ ] Stock prices show live updates
- [ ] No error messages in console (F12)

---

## ✅ AUTO-DEPLOY SETUP (Optional)

To auto-deploy on every git push:
```bash
git push origin main
```

Vercel will automatically rebuild and deploy. No manual steps needed!

---

## 🆘 NEED HELP?

If you hit errors:
1. Check Vercel logs: Dashboard → Deployments → Click failed build → View Logs
2. Most common: Missing `FINNHUB_KEY` (but app still works with mock data)
3. Fix: Add the key and click "Redeploy" on Vercel dashboard

---

**Status:** Ready to deploy  
**Repo:** https://github.com/diaznehemiah91-svg/yp-strategic  
**Build:** ✅ Passing  
**Search:** ✅ Fixed (now navigates to ticker pages)
