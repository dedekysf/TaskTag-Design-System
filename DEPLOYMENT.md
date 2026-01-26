# 🚀 Deployment Guide - TaskTag Design System

## Deployment ke Vercel (Otomatis)

Project ini sudah dikonfigurasi untuk deployment otomatis ke Vercel.

### Setup Awal (Sekali Saja)

#### Opsi 1: Via Vercel Dashboard (Paling Mudah)

1. **Buat akun Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Sign up dengan GitHub account Anda

2. **Import Project**
   - Klik "Add New Project"
   - Pilih repository `TaskTag-Design-System`
   - Klik "Import"

3. **Deploy**
   - Vercel akan otomatis detect konfigurasi dari `vercel.json`
   - Klik "Deploy"
   - Tunggu 1-2 menit
   - ✅ Project Anda sudah live!

#### Opsi 2: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy (dari root project)
vercel

# Untuk production deployment
vercel --prod
```

### Deployment Otomatis

Setelah setup awal, setiap kali Anda push ke GitHub:

- **Push ke branch apapun** → Vercel membuat preview deployment
- **Push/merge ke `main`** → Vercel deploy ke production

### Konfigurasi

File `vercel.json` sudah dikonfigurasi dengan:
- ✅ Build command: `expo export --platform web`
- ✅ Output directory: `dist`
- ✅ SPA routing (untuk Expo Router)
- ✅ Asset caching optimization

### Build Lokal (Testing)

Untuk test build sebelum deploy:

```bash
# Build production
npm run build

# Output akan ada di folder 'dist'
```

### Environment Variables (Jika Diperlukan)

Jika project memerlukan environment variables:

1. Di Vercel Dashboard → Project Settings → Environment Variables
2. Tambahkan variable yang diperlukan
3. Redeploy project

### Custom Domain (Opsional)

1. Di Vercel Dashboard → Project Settings → Domains
2. Tambahkan custom domain Anda
3. Update DNS records sesuai instruksi Vercel

### Troubleshooting

**Build gagal?**
- Cek build logs di Vercel Dashboard
- Pastikan semua dependencies ada di `package.json`
- Test build lokal dengan `npm run build`

**Routing tidak bekerja?**
- Sudah dikonfigurasi di `vercel.json` dengan rewrites
- Pastikan menggunakan Expo Router

**Assets tidak load?**
- Cek path assets menggunakan relative path
- Vercel sudah set caching headers untuk `/assets/*`

### Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → [pilih deployment] → Logs
- **Performance**: Vercel Dashboard → Speed Insights

---

## Alternatif Hosting Gratis

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### GitHub Pages

Memerlukan static export:

```bash
# Build
npm run build

# Deploy ke gh-pages branch
# (perlu setup GitHub Actions atau manual push)
```

---

**🎉 Happy Deploying!**

Untuk pertanyaan atau issue, cek dokumentasi:
- [Vercel Docs](https://vercel.com/docs)
- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
