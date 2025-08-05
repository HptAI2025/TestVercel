# Hướng Dẫn Deploy Lên Vercel

## 🚀 Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Chuẩn bị Repository
1. Tạo repository mới trên GitHub
2. Upload toàn bộ code dự án lên GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Quadratic Equation Solver"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Bước 2: Deploy trên Vercel
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com)
2. Click **"New Project"**
3. **Import** repository từ GitHub
4. Vercel sẽ tự động detect **Vite framework**
5. Kiểm tra cấu hình:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **"Deploy"**

### Bước 3: Cấu hình Domain (Tùy chọn)
- Vercel sẽ tự động tạo domain: `your-project.vercel.app`
- Có thể thêm custom domain trong Settings

---

## 🛠️ Cách 2: Deploy qua Vercel CLI

### Bước 1: Cài đặt Vercel CLI
```bash
npm i -g vercel
```

### Bước 2: Login và Deploy
```bash
# Login vào Vercel
vercel login

# Deploy (development)
vercel

# Deploy production
vercel --prod
```

---

## ⚙️ Cấu hình Quan Trọng

### File `vercel.json` đã được tạo với cấu hình:
```json
{
  "version": 2,
  "name": "quadratic-solver",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "vite"
}
```

### Environment Variables (Nếu cần)
Nếu muốn thay đổi Google Apps Script URL qua environment variables:

1. Trong Vercel Dashboard > Settings > Environment Variables
2. Thêm: `VITE_GOOGLE_SCRIPT_URL` = `your-apps-script-url`
3. Cập nhật code để sử dụng env var:
```typescript
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'fallback-url';
```

---

## 🔍 Kiểm Tra Deployment

### Sau khi deploy thành công:
1. **Kiểm tra URL:** Vercel sẽ cung cấp URL deployment
2. **Test tính năng:**
   - Giải phương trình bậc 2
   - Lưu vào Google Sheets
   - Xem lịch sử
3. **Kiểm tra Console:** Không có lỗi CORS

---

## 🐛 Troubleshooting

### Lỗi Build
```bash
# Kiểm tra build local trước
npm run build

# Nếu có lỗi TypeScript
npm run lint
```

### Lỗi CORS
- Đảm bảo Google Apps Script đã được deploy đúng cách
- Kiểm tra URL Google Apps Script trong code
- Verify quyền "Anyone" trong Apps Script deployment

### Lỗi 404 trên Vercel
- File `vercel.json` đã cấu hình SPA routing
- Tất cả routes sẽ redirect về `index.html`

---

## 📝 Checklist Deploy

- [ ] Code đã được test local (`npm run dev`)
- [ ] Build thành công (`npm run build`)
- [ ] Google Apps Script đã deploy và hoạt động
- [ ] File `vercel.json` đã được cấu hình
- [ ] Repository đã push lên GitHub
- [ ] Deploy trên Vercel thành công
- [ ] Test ứng dụng trên production URL
- [ ] Kiểm tra Google Sheets integration

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công, bạn sẽ có:
- ✅ Ứng dụng web hoạt động trên Vercel
- ✅ Tích hợp Google Sheets
- ✅ Domain tự động từ Vercel
- ✅ HTTPS và CDN global
- ✅ Auto-deploy khi push code mới

