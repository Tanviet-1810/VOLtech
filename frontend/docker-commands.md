# Docker Commands cho Frontend

## 1. Build Docker Image

```powershell
# Di chuyển vào thư mục frontend
cd "c:\Users\dinhh\Downloads\VOLtech-main (1)\VOLtech-main\frontend"

# Build image
docker build -t voltech-frontend .
```

## 2. Run Container

### Development Mode (với Vite dev server)
```powershell
# Chạy container với port mapping
docker run -d `
  --name voltech-frontend `
  -p 5173:5173 `
  -v ${PWD}:/app `
  -v /app/node_modules `
  -e VITE_API_BASE_URL=http://localhost `
  -e VITE_API_PORT=3000 `
  -e VITE_API_PREFIX=/api `
  -e VITE_API_VER=/v1 `
  -e VITE_API_TIMEOUT=5000 `
  -e VITE_CHAT_BOT_API_KEY=your_api_key `
  voltech-frontend
```

### Production Mode (với Nginx)
```powershell
# Chạy container production
docker run -d `
  --name voltech-frontend `
  -p 80:80 `
  voltech-frontend
```

### Production với custom port
```powershell
docker run -d `
  --name voltech-frontend `
  -p 3001:80 `
  voltech-frontend
```

## 3. Quản lý Container

```powershell
# Xem danh sách containers đang chạy
docker ps

# Xem logs
docker logs voltech-frontend

# Xem logs realtime
docker logs -f voltech-frontend

# Dừng container
docker stop voltech-frontend

# Start lại container
docker start voltech-frontend

# Restart container
docker restart voltech-frontend

# Xóa container
docker rm voltech-frontend

# Xóa container đang chạy (force)
docker rm -f voltech-frontend
```

## 4. Build và Run với Docker Compose (Optional)

Tạo file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: voltech-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://localhost
      - VITE_API_PORT=3000
      - VITE_API_PREFIX=/api
      - VITE_API_VER=/v1
      - VITE_API_TIMEOUT=5000
      - VITE_CHAT_BOT_API_KEY=${VITE_CHAT_BOT_API_KEY}
    restart: unless-stopped
```

Chạy với Docker Compose:
```powershell
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

## 5. Quản lý Images

```powershell
# Xem danh sách images
docker images

# Xóa image
docker rmi voltech-frontend

# Build lại image (no cache)
docker build --no-cache -t voltech-frontend .

# Tag image cho registry
docker tag voltech-frontend your-registry/voltech-frontend:latest

# Push to registry
docker push your-registry/voltech-frontend:latest
```

## 6. Truy cập ứng dụng

- **Development**: http://localhost:5173
- **Production**: http://localhost (hoặc port bạn đã map)

## Lưu ý

1. Đảm bảo Docker Desktop đã được cài đặt và đang chạy
2. Cấu hình biến môi trường trong file `.env` hoặc truyền qua `-e` flag
3. Port 80 có thể cần quyền admin trên Windows
4. Sử dụng `${PWD}` trong PowerShell để lấy đường dẫn hiện tại
