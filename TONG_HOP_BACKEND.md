# ZenTask Back-End: Tài liệu tổng hợp

Back-end cho ứng dụng học tập **ZenTask** (client Android). Người dùng tải lên tài liệu (ảnh/PDF), AI (Google Gemini) tách nội dung thành **dàn ý phân cấp**, hệ thống tự **lên lịch học** đến hạn deadline, theo dõi **tiến độ** và **chuỗi ngày học (streak)**.

---

## 1. Công nghệ sử dụng

| Thành phần | Thư viện |
|---|---|
| Runtime / Framework | Node.js, Express 5 (CommonJS) |
| Cơ sở dữ liệu | SQL Server (`mssql`) qua ORM Sequelize 6 |
| Xác thực | JWT (`jsonwebtoken`), mã hóa mật khẩu `bcrypt` |
| Upload file | `multer` (lưu trong bộ nhớ RAM) |
| Lưu trữ file | Cloudinary |
| AI | `@google/generative-ai` (Gemini) |
| Đọc PDF | `pdf-parse` |
| Khác | `cors`, `dotenv`, `nodemon` (dev) |

### Scripts (`package.json`)

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy toàn bộ server với nodemon (`src/server.js`) |
| `npm run dev:auth` | Chỉ bật các route xác thực (`src/server.auth.js` đặt `AUTH_ONLY=1`) |
| `npm start` | Chạy production bằng node |

---

## 2. Cấu trúc thư mục

```
ZenTask_BackEnd/
├── .env.example
├── package.json
├── postman/                     # Bộ collection Postman (Register, Login, Home, Input)
└── src/
    ├── server.js                # Điểm khởi động: kết nối DB rồi listen PORT
    ├── server.auth.js           # Khởi động chế độ chỉ có auth
    ├── app.js                   # Khởi tạo Express, CORS, JSON, /health, /api, error middleware
    ├── config/
    │   ├── env.js               # Đọc & kiểm tra biến môi trường
    │   └── db.js                # Kết nối Sequelize tới SQL Server
    ├── routes/                  # Khai báo endpoint
    ├── controllers/             # Nhận request, gọi service, trả response
    ├── services/                # Logic nghiệp vụ
    │   └── prompts/prompts.js   # Prompt gửi cho Gemini
    ├── middlewares/             # auth, upload, error
    ├── models/                  # Model Sequelize + quan hệ
    └── utils/                   # jwt, pdf, response
```

Luồng xử lý: **Route → Middleware → Controller → Service → Model (DB)**.

---

## 3. Cấu hình môi trường (`.env`)

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `PORT` | | Cổng server (mặc định `3000`) |
| `DB_SERVER` | ✔ | Host SQL Server (vd `localhost`) |
| `DB_INSTANCE` | | Tên instance (vd `SQLEXPRESS`) |
| `DB_USER` | ✔ | Tài khoản DB |
| `DB_PASSWORD` | ✔ | Mật khẩu DB |
| `DB_NAME` | ✔ | Tên database (`ZenTask`) |
| `JWT_SECRET` | | Khóa ký JWT (mặc định `chuoi_bi_mat_mac_dinh`) |
| `GEMINI_API_KEY` | | API key Google Gemini |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | | Thông tin Cloudinary |

`src/config/env.js` sẽ **throw lỗi** nếu thiếu một trong các biến DB bắt buộc.
`src/config/db.js` kết nối với `encrypt: false`, `trustServerCertificate: true` (phù hợp chạy local), tắt log SQL.

---

## 4. Cơ sở dữ liệu

### Quan hệ

```
Users (1) ──< (n) Subjects (1) ──< (n) DanY
                                        │
                                        └── ParentId → DanY.IdDanY (cây tự tham chiếu)
```

- `User.hasMany(Subject)` / `Subject.belongsTo(User)` qua `IdUser`
- `Subject.hasMany(DanY)` / `DanY.belongsTo(Subject)` qua `IdSubject`
- `DanY` tự liên kết: alias `MucCha` (cha) và `MucCon` (con) qua `ParentId`

### Bảng `Users` (`user.model.js`)

| Cột | Kiểu | Ghi chú |
|---|---|---|
| IdUser | INT, PK, identity | |
| HoTen | NVARCHAR(30) | not null |
| Email | NVARCHAR(20) | not null, unique |
| Password_Hash | NVARCHAR(255) | ẩn mặc định (defaultScope); dùng scope `withPassword` khi đăng nhập |
| Avatar_Url | NVARCHAR(255) | nullable |
| Ngay_Tao | DATETIME | mặc định NOW |
| HoatDongLanCuoi | DATETIME | mặc định NOW |
| ChuoiHienTai | INT | streak hiện tại, mặc định 0 |
| HoatDongGanNhat | DATE | ngày hoạt động gần nhất (tính streak) |

### Bảng `Subjects` (`subject.model.js`)

| Cột | Kiểu | Ghi chú |
|---|---|---|
| IdSubject | INT, PK, identity | |
| IdUser | INT | FK → Users |
| LoaiMau | TINYINT | loại màu hiển thị |
| Ten | NVARCHAR(30) | tên môn/chủ đề |
| Deadline | DATE | nullable, thuộc tính model tên là `DeadLine`. Subject mới tạo từ màn "Tạo Dàn Ý" chưa có hạn chót |
| TongSoMuc | INT | tổng số mục dàn ý, mặc định 0 |
| SoMucHoanThanh | INT | số mục đã hoàn thành, mặc định 0 |

### Bảng `DanY` – Dàn ý (`dany.model.js`)

| Cột | Kiểu | Ghi chú |
|---|---|---|
| IdDanY | INT, PK, identity | |
| IdSubject | INT | FK → Subjects |
| ParentId | INT | nullable, FK → DanY (mục cha) |
| TieuDe | NVARCHAR(500) | |
| NoiDung | TEXT | |
| ThuTu | INT | thứ tự |
| CapDo | INT | cấp độ (1 là cao nhất) |
| DoTinCay | DECIMAL(4,3) | độ tin cậy do AI trả về (0–1) |
| TrangThaiHoanThanh | BIT | mặc định 0 |
| NgayNhap | DATETIME | mặc định NOW |
| NgayHoanThanh | DATETIME | nullable |
| NgayLenLich | DATE | ngày được xếp lịch học |
| NguonLoi | NVARCHAR(500) | nullable |

Tất cả model đều đặt `timestamps: false`.

---

## 5. Danh sách API

Base URL: `http://localhost:3000`

Mọi response đều có dạng:

```json
{ "success": true, "data": ... }
{ "success": false, "message": "..." }
```

Các route có 🔒 cần header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/health` | | Kiểm tra server |
| POST | `/api/auth/register` | | Đăng ký |
| POST | `/api/auth/login` | | Đăng nhập, trả JWT |
| GET | `/api/home` | 🔒 | Dữ liệu trang chủ |
| POST | `/api/subject` | 🔒 | Tạo Subject mới (chưa có deadline) |
| POST | `/api/input/process` | 🔒 | Upload file → AI tạo dàn ý |
| POST | `/api/lichhoc/:idSubject` | 🔒 | Tự lên lịch học cho Subject |
| GET | `/api/lichhoc/:ngay` | 🔒 | Xem lịch học theo ngày (`YYYY-MM-DD`) |
| PATCH | `/api/lichhoc/:idDanY/hoanthanh` | 🔒 | Đánh dấu hoàn thành 1 mục |

Khi chạy `npm run dev:auth`, chỉ có nhóm `/api/auth`.

### 5.1 `POST /api/auth/register`

Body:
```json
{ "hoten": "Nguyễn Văn A", "email": "a@gmail.com", "password": "123456" }
```
- Kiểm tra email đã tồn tại → lỗi `"Email đã tồn tại"` (400).
- Băm mật khẩu bằng bcrypt (salt rounds = 10), tạo user mới.
- Trả về thông tin user vừa tạo.

### 5.2 `POST /api/auth/login`

Body:
```json
{ "email": "a@gmail.com", "password": "123456" }
```
- Sai email → `"Email không đúng"`; sai mật khẩu → `"Mật khẩu không đúng"` (400).
- Thành công trả `{ "token": "<JWT>" }`, payload `{ userId }`, hạn **7 ngày**.

### 5.3 `GET /api/home` 🔒

Truy vấn song song (`Promise.all`):
- Thông tin user (lấy `ChuoiHienTai`).
- Tất cả Subject của user, kèm `PhanTram = round(SoMucHoanThanh / TongSoMuc * 100)`.
- 5 mục DanY hoàn thành gần nhất của user (kèm tên Subject).

Response `data`:
```json
{
  "streak": 3,
  "subjects": [{ "IdSubject": 1, "Ten": "Toán", "TongSoMuc": 10, "SoMucHoanThanh": 4, "PhanTram": 40, "...": "..." }],
  "recentActivities": [{ "IdDanY": 5, "TieuDe": "...", "Subject": { "Ten": "Toán" }, "...": "..." }]
}
```

### 5.4 `POST /api/subject` 🔒

Body:
```json
{ "ten": "Toán cao cấp", "loaiMau": 1 }
```
- `ten`: bắt buộc, tối đa 30 ký tự. `loaiMau`: số nguyên 0–255.
- Subject được tạo với `DeadLine = null`, `TongSoMuc = 0`.
- Trả 201, `data`: `{ "idSubject": 12 }`. Sai dữ liệu → 400.

Luồng màn "Tạo Dàn Ý" trên Android: gọi `POST /api/subject` → lấy `idSubject` → gọi `POST /api/input/process` với đúng `idSubject` đó.

### 5.5 `POST /api/input/process` 🔒

`multipart/form-data`: `file` (ảnh hoặc PDF), `idSubject`.
Subject phải thuộc user đang đăng nhập, nếu không trả 404.

Luồng xử lý:

```
file PDF?
 ├─ Có → trích text bằng pdf-parse
 │       ├─ text > 50 ký tự → gửi text cho Gemini (gemini-flash-lite-latest)
 │       └─ PDF scan        → upload Cloudinary (raw) → tải lại → gửi base64 cho Gemini (gemini-flash-lite-latest) để OCR
 └─ Ảnh  → upload Cloudinary (image) → gửi base64 cho Gemini (gemini-flash-lite-latest)
        ↓
AI trả mảng phẳng [{ TieuDe, CapDo, ThuTu, DoTinCay }]
        ↓
luuCayVaoDB(): dựng cây ParentId theo CapDo bằng stack, lưu từng mục vào DanY (trong 1 transaction)
        ↓
Subject.TongSoMuc += số mục vừa lưu
```

Thuật toán dựng cây (`dany.service.js`): duyệt lần lượt, pop stack khi đỉnh stack có `CapDo >= CapDo` mục hiện tại; mục cha là đỉnh stack còn lại (hoặc `null`).

Trả về mảng các bản ghi DanY đã lưu. Lỗi 400 nếu thiếu `idSubject`/`file`; lỗi nếu Subject không tồn tại.

### 5.6 `POST /api/lichhoc/:idSubject` 🔒

- Kiểm tra Subject thuộc về user.
- Subject chưa có `DeadLine` → lỗi 400 `"Subject chưa có hạn chót..."`.
- Lấy các DanY chưa có `NgayLenLich`, sắp theo `ThuTu`.
- `soNgay = max(1, ceil((Deadline − hôm nay) / 1 ngày))`, `soMucMoiNgay = ceil(tổng mục / soNgay)`.
- Chia đều: mục thứ `i` được xếp vào ngày `hôm nay + floor(i / soMucMoiNgay)`.
- Trả về danh sách mục đã xếp lịch (mảng rỗng nếu không còn mục nào chưa xếp).

### 5.7 `GET /api/lichhoc/:ngay` 🔒

Trả danh sách DanY có `NgayLenLich = ngay` thuộc các Subject của user, sắp theo `ThuTu`, kèm tên Subject.

### 5.8 `PATCH /api/lichhoc/:idDanY/hoanthanh` 🔒

- Kiểm tra mục thuộc về user; lỗi nếu đã hoàn thành trước đó.
- Đặt `TrangThaiHoanThanh = true`, `NgayHoanThanh = now`.
- `Subject.SoMucHoanThanh += 1`.
- Cập nhật streak (`tinhStreakMoi`):
  - Chưa có hoạt động → 1
  - Cùng ngày → giữ nguyên
  - Cách 1 ngày → +1
  - Cách > 1 ngày → reset về 1
- Cập nhật `HoatDongGanNhat = hôm nay`.

---

## 6. Middleware

| File | Chức năng |
|---|---|
| `auth.middleware.js` | Đọc `Authorization: Bearer <token>`, giải mã JWT, gán `req.userId`. Thiếu/sai token → 401 |
| `upload.middleware.js` | `multer` với `memoryStorage()` (file nằm trong `req.file.buffer`) |
| `error.middleware.js` | Bắt lỗi chung, log và trả 500 `{ success: false, message }` |

---

## 7. Services

| File | Hàm | Chức năng |
|---|---|---|
| `auth.service.js` | `register`, `login` | Đăng ký, đăng nhập |
| `home.service.js` | `gethomeService` | Tổng hợp dữ liệu trang chủ |
| `subject.service.js` | `taoSubject` | Tạo Subject mới, trả `idSubject` |
| `ai.service.js` | `xuLyTuText`, `xuLyTuFile` | Gọi Gemini, làm sạch ```` ```json ```` và parse JSON |
| `storage.service.js` | `uploadFile` | Upload buffer lên Cloudinary bằng stream, trả `secure_url` |
| `dany.service.js` | `luuCayVaoDB` | Lưu mảng phẳng thành cây DanY |
| `lichhoc.service.js` | `taoLich`, `xemLich`, `danhDauHoanThanh` | Lên lịch, xem lịch, hoàn thành + streak |
| `prompts/prompts.js` | `taoDanYTuText`, `taoDanYTuFile`, `boSungDanY` | Prompt cho AI (`boSungDanY` dùng để bổ sung dàn ý, hiện chưa được gọi) |

---

## 8. Utils

| File | Hàm | Chức năng |
|---|---|---|
| `jwt.util.js` | `taoToken(payload, expiresIn='7d')`, `giaimaToken(token)` | Tạo / xác minh JWT |
| `pdf.util.js` | `trichXuatText(buffer)` | Trích text từ PDF |
| `response.util.js` | `sendSuccess`, `sendError` | Helper chuẩn hóa response (hiện controller chưa dùng) |

---

## 9. Postman

Thư mục `postman/collections/ZenTask/` có sẵn các request: **Register**, **Login**, **Home**, **Input**. Luồng test: Register → Login (lấy token) → gắn token vào Home/Input.

---

## 10. Lưu ý

Các lỗi đã được sửa:

- Lên lịch học đọc đúng thuộc tính `subject.DeadLine`.
- `/api/input/process` kiểm tra Subject thuộc về user trước khi upload và gọi AI. Nếu không thuộc, trả 404.
- `luuCayVaoDB` lưu toàn bộ dàn ý và cập nhật `TongSoMuc` trong cùng 1 transaction.
- Streak được tính theo ngày (bỏ phần giờ). Mục hoàn thành đầu tiên của user mới được tính streak = 1.
- Nhánh đọc ảnh/PDF scan dùng model `gemini-flash-lite-latest`.
- `.env.example` đã có đủ biến và comment đúng cú pháp `#`.

Còn lại cần làm thủ công:

- **Cột `Email` chỉ dài 20 ký tự** (`NVARCHAR(20)`), nhiều địa chỉ email sẽ bị vượt độ dài này. Cần tăng độ dài cột ở cả database (`ALTER TABLE Users ALTER COLUMN Email NVARCHAR(100)`, lưu ý có ràng buộc UNIQUE) và `user.model.js`.
- Nên đặt `JWT_SECRET` riêng khi triển khai thật.
