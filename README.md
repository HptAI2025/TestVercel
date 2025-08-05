# Quadratic Equation Solver

Ứng dụng giải phương trình bậc 2 với tích hợp Google Sheets để lưu trữ dữ liệu.

## 🚀 Tính năng

- ✅ Giải phương trình bậc 2 (ax² + bx + c = 0)
- ✅ Tích hợp Google Sheets để lưu trữ dữ liệu
- ✅ Xem lịch sử các phương trình đã giải
- ✅ Giao diện responsive, thân thiện với người dùng
- ✅ Ghi chú tùy chọn cho từng phương trình

## 🛠️ Công nghệ sử dụng

- **Frontend:** React + TypeScript + Vite
- **Styling:** CSS3 với responsive design
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Deployment:** Vercel

## 📦 Cài đặt và chạy local

```bash
# Clone repository
git clone <repository-url>
cd quadratic-manager

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview
```

## 🌐 Deploy lên Vercel

### Cách 1: Vercel CLI
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

### Cách 2: Vercel Dashboard
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import từ Git repository
4. Vercel sẽ tự động detect Vite framework
5. Deploy

## ⚙️ Cấu hình Google Apps Script

### 1. Tạo Google Apps Script Project
1. Vào [Google Apps Script](https://script.google.com)
2. Tạo project mới
3. Copy code từ file `google-apps-script-v3.js`
4. Save project

### 2. Deploy Web App
1. Click "Deploy" > "New deployment"
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Deploy và copy URL

### 3. Cập nhật URL trong code
Thay đổi `GOOGLE_SCRIPT_URL` trong file `src/App.tsx`:
```typescript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

## 📊 Cấu trúc Google Sheets

Tạo Google Sheets với các cột:
- **ID:** Unique identifier
- **A:** Hệ số a
- **B:** Hệ số b  
- **C:** Hệ số c
- **X1:** Nghiệm thứ nhất
- **X2:** Nghiệm thứ hai
- **SolutionType:** Loại nghiệm
- **SolvedAt:** Thời gian giải
- **Note:** Ghi chú

## 🔧 Giải quyết vấn đề CORS

Dự án sử dụng giải pháp đặc biệt để fix CORS với Google Apps Script:
- Sử dụng `Content-Type: text/plain;charset=utf-8` thay vì `application/json`
- Parse JSON từ `e.postData.contents` trong Apps Script
- Bypass preflight check của browser

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview build locally
- `npm run lint` - Chạy ESLint

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Demo:** [https://pskfdomf.manus.space](https://pskfdomf.manus.space)
- **Google Sheets:** [Database](https://docs.google.com/spreadsheets/d/1wjmlenw_S2DDnma2STo-bVWY-JWGIKdEOvsk33dGIis/edit)
