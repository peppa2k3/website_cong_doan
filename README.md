# Cổng thông tin điện tử Công đoàn

Hệ thống website Công đoàn nội bộ cấp doanh nghiệp: website công khai (tin tức, văn bản, cơ cấu tổ chức, hỏi đáp, tiếp nhận góp ý/phản ánh/tố cáo) + trang quản trị nội dung đầy đủ dành cho cán bộ Công đoàn.

Đây là một **hệ thống sẵn sàng vận hành** (không phải demo): có xác thực JWT, phân quyền RBAC, audit log, sao lưu dữ liệu tự động, và kiến trúc module hoá dễ mở rộng.

---

## 1. Kiến trúc hệ thống

```
congdoan-portal/
├── backend/                # Node.js + Express + MongoDB (Mongoose) REST API
│   ├── config/              # Kết nối DB, danh sách permission & role mặc định
│   ├── models/               # Schema: User, Role, News, Document, Organization,
│   │                          # Banner, Media, Faq, Feedback, AuditLog
│   ├── middleware/           # auth (JWT), rbac, upload (multer), auditLogger, errorHandler
│   ├── controllers/          # Logic nghiệp vụ theo từng module
│   ├── routes/                # REST endpoints (tách biệt route quản trị & route công khai)
│   ├── scripts/seed.js        # Khởi tạo role, tài khoản superadmin, dữ liệu mẫu
│   └── server.js
├── frontend/                # React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── components/       # layout (Navbar/Footer/Sidebar), admin (DataTable, Modal...), public, common
│       ├── pages/public/      # Trang chủ, Giới thiệu, Cơ cấu tổ chức, Tin tức, Văn bản, Hỏi đáp, Liên hệ...
│       ├── pages/admin/       # Toàn bộ trang quản trị (được tách chunk riêng, lazy-load)
│       ├── context/           # AuthContext (JWT + quyền), ToastContext
│       └── services/api.js    # Axios instance tự động refresh access token
├── scripts/backup.sh         # Sao lưu MongoDB tự động mỗi ngày (chạy trong container riêng)
├── scripts/restore.sh        # Hướng dẫn/khôi phục dữ liệu từ bản sao lưu
└── docker-compose.yml        # Điều phối mongo + backend + frontend + mongo-backup
```

### Vì sao gộp "Tin tức" + "Thông báo" + "Hoạt động truyền thông" vào 1 collection `News`?
Ba mục này có cùng cấu trúc dữ liệu (tiêu đề, tóm tắt, nội dung, hình ảnh...), chỉ khác nhau ở cách hiển thị. Thay vì tạo 3 model trùng lặp, hệ thống dùng field `category` (`tin_tuc` / `thong_bao` / `hoat_dong`) — giúp cán bộ Công đoàn quản lý tập trung tại **một** màn hình "Tin tức & Thông báo", đúng tinh thần dễ bảo trì/mở rộng mà yêu cầu đề ra. "Thông báo mới" trên trang chủ chính là tin có `isPinned = true`.

### Vì sao đoàn viên không cần đăng nhập để gửi góp ý/phản ánh/tố cáo?
Theo đúng yêu cầu, đoàn viên cần: xem nội dung công khai, gửi góp ý/phản ánh/**tố cáo có thể ẩn danh**, và theo dõi trạng thái xử lý. Bắt buộc đăng nhập sẽ mâu thuẫn với yêu cầu ẩn danh khi tố cáo. Hệ thống thay vào đó:
- Mỗi lượt gửi tạo một **mã tra cứu** (vd: `TC-7K3F9D`) và yêu cầu người gửi tự đặt **mã PIN**.
- Trang **"Tra cứu trạng thái xử lý"** (`/tra-cuu`) dùng mã tra cứu + PIN để xem trạng thái và các phản hồi từ Công đoàn — không lộ danh tính nếu chọn ẩn danh.

Model `User`/`Role` đã có sẵn vai trò `member` (đoàn viên) dự phòng — nếu sau này cần thêm cổng đăng nhập riêng cho đoàn viên (vd. xem lịch sử tất cả phản ánh đã gửi, nhận thông báo cá nhân hoá...), chỉ cần bật thêm route đăng nhập public dùng chung cơ chế JWT hiện có.

---

## 2. Phân quyền (RBAC)

4 vai trò mặc định (khởi tạo qua `npm run seed`), định nghĩa tại `backend/config/permissions.js`:

| Vai trò | Quyền hạn |
|---|---|
| **Quản trị hệ thống** (`superadmin`) | Toàn quyền, bao gồm quản lý tài khoản, vai trò, cấu hình hệ thống |
| **Cán bộ Công đoàn** (`union_admin`) | Toàn bộ nội dung + xử lý góp ý/phản ánh/tố cáo + quản lý người dùng |
| **Biên tập viên** (`editor`) | Tin tức, văn bản, banner, thư viện ảnh/video, hỏi đáp |
| **Đoàn viên** (`member`) | Dự phòng mở rộng, hiện chưa có quyền quản trị |

Thêm vai trò/quyền mới: sửa `DEFAULT_ROLES` trong `backend/config/permissions.js` rồi chạy lại `npm run seed` (idempotent — không tạo trùng), hoặc quản lý trực tiếp qua collection `roles` khi hệ thống đã vận hành.

Middleware `protect` (xác thực JWT) + `authorize(...permissions)` (kiểm tra quyền) được áp lên từng route trong `backend/routes/*`. Frontend ẩn/hiện menu và chặn trang tương ứng qua `useAuth().hasPermission(...)`, nhưng **quyền thật sự luôn được backend kiểm tra lại** — frontend chỉ phục vụ UX.

---

## 3. Chạy bằng Docker Compose (khuyến nghị)

### Bước 1 — Cấu hình biến môi trường
```bash
cp backend/.env.example backend/.env
# Mở backend/.env, đổi JWT_ACCESS_SECRET, JWT_REFRESH_SECRET và SEED_ADMIN_PASSWORD
```

### Bước 2 — Khởi chạy
```bash
docker compose up -d --build
```

### Bước 3 — Khởi tạo dữ liệu ban đầu (role, tài khoản superadmin, dữ liệu mẫu)
```bash
docker compose exec backend npm run seed
```

Sau đó truy cập:
- Website công khai: `http://localhost`
- Trang quản trị: `http://localhost/admin/login`
- Tài khoản đăng nhập đầu tiên: theo `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` trong `backend/.env` — **đổi mật khẩu ngay sau khi đăng nhập lần đầu** (mục "Tài khoản của tôi" trong trang quản trị).

### Sao lưu dữ liệu
Container `mongo-backup` tự động chạy `mongodump` mỗi 24 giờ, lưu vào thư mục `./backups` trên máy host, tự xoá bản cũ hơn 14 ngày (chỉnh `RETENTION_DAYS` trong `scripts/backup.sh`). Khôi phục: xem hướng dẫn trong `scripts/restore.sh`.

---

## 4. Chạy ở môi trường phát triển (không dùng Docker)

**Yêu cầu:** Node.js 20+, MongoDB 6+ đang chạy tại `mongodb://localhost:27017`.

```bash
# Backend
cd backend
cp .env.example .env      # sửa MONGO_URI thành mongodb://localhost:27017/congdoan_portal nếu chạy Mongo local
npm install
npm run seed               # tạo role + tài khoản superadmin
npm run dev                 # http://localhost:5000

# Frontend (terminal khác)
cd frontend
npm install
npm run dev                 # http://localhost:3000 (đã cấu hình proxy /api, /uploads -> :5000 trong vite.config.js)
```

---

## 5. Triển khai production sau Traefik / reverse proxy có sẵn (HTTPS)

Nếu server đã có Traefik + Let's Encrypt (mô hình phổ biến khi tự triển khai VPS), **không cần** publish cổng 80 của service `frontend` ra ngoài — thay vào đó gắn label Traefik và để `frontend` (nginx) tiếp tục lo việc proxy nội bộ `/api` và `/uploads` sang `backend` như cấu hình sẵn trong `frontend/nginx.conf`. Ví dụ chỉnh `docker-compose.yml`:

```yaml
frontend:
  build: ./frontend
  # bỏ "ports: - 80:80"
  networks: [congdoan-net, traefik-public]
  labels:
    - traefik.enable=true
    - traefik.http.routers.congdoan.rule=Host(`congdoan.doanhnghiep.vn`)
    - traefik.http.routers.congdoan.entrypoints=websecure
    - traefik.http.routers.congdoan.tls.certresolver=letsencrypt
    - traefik.http.services.congdoan.loadbalancer.server.port=80

networks:
  traefik-public:
    external: true
```
Nhớ cập nhật `CLIENT_URL` trong `backend/.env` thành domain HTTPS thật để CORS hoạt động đúng.

---

## 6. Bảo mật đã áp dụng

- **JWT 2 lớp**: access token ngắn hạn (mặc định 2h, gửi qua header `Authorization`) + refresh token dài hạn (7 ngày, lưu ở cookie `httpOnly` + hash trong DB, tự xoay vòng).
- **RBAC** kiểm tra ở middleware backend cho mọi route quản trị.
- **Rate limiting**: giới hạn số lần đăng nhập sai và số lượt gửi góp ý/phản ánh/tố cáo trong 1 giờ để chống spam/brute-force.
- **Helmet, mongo-sanitize, CORS whitelist theo domain**.
- **Audit Log**: mọi thao tác tạo/sửa/xoá ở khu quản trị đều ghi lại người thực hiện, thời gian, IP, mô tả — xem tại "Nhật ký hệ thống".
- **Kiểm tra loại & dung lượng file upload** (ảnh, văn bản, media) qua `multer` + whitelist phần mở rộng.
- Mật khẩu băm bằng `bcrypt` (12 rounds); không bao giờ trả `password`/`refreshTokenHash` ra API.

**Trước khi đưa vào vận hành thật, cần bổ sung:** đổi toàn bộ secret mặc định trong `.env`, bật xác thực cho MongoDB (`MONGO_INITDB_ROOT_USERNAME`/`PASSWORD` + cập nhật `MONGO_URI`), cấu hình HTTPS (Traefik/Nginx + Let's Encrypt như mục 5), và giới hạn cổng `5000`/`27017` không public ra internet.

---

## 7. Hướng mở rộng gợi ý

- Thêm module "Trang nội dung tĩnh" (page builder) nếu muốn cán bộ Công đoàn tự chỉnh sửa nội dung trang **Giới thiệu** qua giao diện thay vì sửa code.
- Thêm gửi email/SMS thông báo tự động khi phản ánh được cập nhật trạng thái (hiện đã có sẵn cấu trúc `responses[]` để gắn thêm trigger).
- Bật cổng đăng nhập riêng cho đoàn viên (role `member` đã có sẵn) nếu cần cá nhân hoá sâu hơn (lịch sử phản ánh, thông báo riêng...).
- Thêm Elasticsearch nếu lượng văn bản/tin tức lớn và cần tìm kiếm nâng cao hơn so với MongoDB text index hiện tại.
- Thêm 2FA cho tài khoản quản trị.

---

## 8. Tài khoản mặc định (chỉ sau khi chạy `npm run seed`)

| Trường | Giá trị mặc định (đổi trong `backend/.env`) |
|---|---|
| Tên đăng nhập | `superadmin` |
| Mật khẩu | `DoiMatKhauNgay!123` — **bắt buộc đổi ngay** |

