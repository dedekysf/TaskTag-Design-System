# 🚀 Quick Deploy to Vercel

## Langkah Cepat (5 Menit)

### 1️⃣ Buka Vercel
Kunjungi: https://vercel.com

### 2️⃣ Sign Up / Login
- Klik "Sign Up" atau "Login"
- Pilih "Continue with GitHub"
- Authorize Vercel untuk akses GitHub Anda

### 3️⃣ Import Project
- Klik "Add New..." → "Project"
- Pilih repository: `TaskTag-Design-System`
- Klik "Import"

### 4️⃣ Configure Project
Vercel akan otomatis detect konfigurasi dari `vercel.json`:
- ✅ Framework Preset: Other
- ✅ Build Command: `expo export --platform web`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**Tidak perlu ubah apapun!** Klik "Deploy"

### 5️⃣ Tunggu Deploy Selesai
- Proses build: ~2-3 menit
- Status akan berubah menjadi "Ready"
- Anda akan mendapat URL: `https://tasktag-design-system.vercel.app`

### 6️⃣ Selesai! 🎉

Project Anda sudah live dan bisa diakses!

---

## Deployment Otomatis Selanjutnya

Setelah setup awal, **TIDAK PERLU DEPLOY MANUAL LAGI!**

Setiap kali Anda:
```bash
git add .
git commit -m "update: ..."
git push
```

Vercel akan **otomatis**:
1. Detect perubahan di GitHub
2. Build project
3. Deploy ke production
4. Update URL yang sama

---

## Monitoring Deployment

### Cek Status Deploy
1. Buka Vercel Dashboard
2. Pilih project "TaskTag-Design-System"
3. Lihat tab "Deployments"

### Lihat Logs
1. Klik deployment yang sedang berjalan
2. Tab "Building" → lihat build logs
3. Tab "Functions" → lihat runtime logs (jika ada)

### Analytics
- Tab "Analytics" → lihat traffic dan performance
- Tab "Speed Insights" → lihat Core Web Vitals

---

## Custom Domain (Opsional)

Jika ingin domain sendiri (misal: `design.tasktag.com`):

1. **Di Vercel Dashboard**
   - Project Settings → Domains
   - Klik "Add"
   - Masukkan domain Anda

2. **Di DNS Provider Anda**
   - Tambahkan CNAME record:
     ```
     design.tasktag.com → cname.vercel-dns.com
     ```

3. **Tunggu Propagasi**
   - 5-10 menit
   - SSL otomatis di-setup oleh Vercel

---

## Troubleshooting

### Build Gagal?
```bash
# Test build lokal dulu
npm run build

# Jika berhasil lokal tapi gagal di Vercel:
# - Cek Node.js version di Vercel (Settings → General)
# - Pastikan sama dengan lokal (18.x atau 20.x)
```

### Routing 404?
- Sudah dikonfigurasi di `vercel.json`
- Jika masih error, cek Vercel logs

### Assets Tidak Load?
- Pastikan path menggunakan relative path
- Contoh: `./assets/image.png` bukan `/assets/image.png`

---

## Environment Variables

Jika project butuh env variables:

1. **Lokal**: buat `.env.local`
2. **Vercel**: 
   - Settings → Environment Variables
   - Add variable
   - Redeploy

---

## Rollback Deployment

Jika deployment baru bermasalah:

1. Vercel Dashboard → Deployments
2. Pilih deployment sebelumnya yang stabil
3. Klik "..." → "Promote to Production"

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/workflow/web/
- GitHub Issues: Create issue di repository ini
