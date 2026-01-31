# Deployment Guide

## Railway

### 1. Install Railway CLI
```bash
npm i -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Initialize Project
```bash
cd /root/OpenClawBUJO
railway init
```

### 4. Deploy
```bash
railway up
```

### 5. Add Domain (Optional)
```bash
railway domain
```

Railway will automatically:
- Detect Node.js app
- Run `npm install`
- Start with `npm start`
- Assign a public URL

### Environment Variables

Railway auto-sets `PORT`. No additional env vars needed for basic setup.

---

## Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
cd /root/OpenClawBUJO
vercel
```

### 3. Production Deploy
```bash
vercel --prod
```

---

## Access from Phone

Once deployed, you'll get a URL like:
- Railway: `https://openclaw-bujo-production.up.railway.app`
- Vercel: `https://openclaw-bujo.vercel.app`

Bookmark it on your phone for instant access to your bullet journal from anywhere.

---

## Local Development

```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

Access at: http://localhost:3000
