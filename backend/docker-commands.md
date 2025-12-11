# Docker Commands cho Backend

## 1. Build Docker Image

```powershell
# Di chuyển vào thư mục backend
cd "c:\Users\dinhh\Downloads\VOLtech-main (1)\VOLtech-main\backend"

# Build image
docker build -t voltech-backend .
```

## 2. Run Container

### Standalone (không có MongoDB local)
```powershell
# Chạy container với port mapping
docker run -d `
  --name voltech-backend `
  -p 3000:3000 `
  -e NODE_ENV=production `
  -e MONGODB_URI=mongodb://host.docker.internal:27017/voltech `
  -e JWT_SECRET=your_jwt_secret_key_min_32_characters `
  -e JWT_EXPIRES_IN=15m `
  -e JWT_REFRESH_EXPIRES_IN=7d `
  -e HOST=0.0.0.0 `
  -e PORT=3000 `
  -e CORS_ORIGIN=http://localhost `
  -e CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS `
  -e CORS_CREDENTIALS=true `
  voltech-backend
```

### Với file .env
```powershell
# Chạy với env file
docker run -d `
  --name voltech-backend `
  -p 3000:3000 `
  --env-file .env `
  voltech-backend
```

### Development Mode (với volume mount)
```powershell
# Chạy với hot reload
docker run -d `
  --name voltech-backend-dev `
  -p 3000:3000 `
  -v ${PWD}:/app `
  -v /app/node_modules `
  --env-file .env `
  voltech-backend `
  pnpm run dev
```

## 3. Quản lý Container

```powershell
# Xem danh sách containers đang chạy
docker ps

# Xem logs
docker logs voltech-backend

# Xem logs realtime
docker logs -f voltech-backend

# Kiểm tra health status
docker inspect --format='{{.State.Health.Status}}' voltech-backend

# Dừng container
docker stop voltech-backend

# Start lại container
docker start voltech-backend

# Restart container
docker restart voltech-backend

# Xóa container
docker rm voltech-backend

# Xóa container đang chạy (force)
docker rm -f voltech-backend
```

## 4. Docker Compose - Chạy cả Frontend + Backend + MongoDB

Tạo file `docker-compose.yml` ở thư mục root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: voltech-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=voltech
    restart: unless-stopped
    networks:
      - voltech-network

  backend:
    build: ./backend
    container_name: voltech-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/voltech
      - JWT_SECRET=${JWT_SECRET:-your_jwt_secret_key_min_32_characters}
      - JWT_EXPIRES_IN=15m
      - JWT_REFRESH_EXPIRES_IN=7d
      - HOST=0.0.0.0
      - PORT=3000
      - CORS_ORIGIN=http://localhost
      - CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
      - CORS_CREDENTIALS=true
    depends_on:
      - mongodb
    restart: unless-stopped
    networks:
      - voltech-network

  frontend:
    build: ./frontend
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
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - voltech-network

volumes:
  mongodb_data:

networks:
  voltech-network:
    driver: bridge
```

### Chạy toàn bộ stack với Docker Compose:

```powershell
# Di chuyển về thư mục root
cd "c:\Users\dinhh\Downloads\VOLtech-main (1)\VOLtech-main"

# Start tất cả services
docker-compose up -d

# Start và rebuild nếu có thay đổi
docker-compose up -d --build

# Stop tất cả services
docker-compose down

# Stop và xóa volumes
docker-compose down -v

# View logs tất cả services
docker-compose logs -f

# View logs của một service cụ thể
docker-compose logs -f backend

# Restart một service
docker-compose restart backend

# Xem status của các services
docker-compose ps
```

## 5. Kết nối với MongoDB

### MongoDB trong Docker
```powershell
# Kết nối vào MongoDB container
docker exec -it voltech-mongodb mongosh

# Trong mongosh:
use voltech
show collections
db.users.find()
```

### MongoDB local (ngoài Docker)
Sử dụng `host.docker.internal` để kết nối:
```
MONGODB_URI=mongodb://host.docker.internal:27017/voltech
```

## 6. Quản lý Images

```powershell
# Xem danh sách images
docker images

# Xóa image
docker rmi voltech-backend

# Build lại image (no cache)
docker build --no-cache -t voltech-backend .

# Tag image cho registry
docker tag voltech-backend your-registry/voltech-backend:latest

# Push to registry
docker push your-registry/voltech-backend:latest
```

## 7. Network và Debugging

```powershell
# Xem networks
docker network ls

# Inspect network
docker network inspect voltech-network

# Exec vào container để debug
docker exec -it voltech-backend sh

# Trong container shell:
# - Kiểm tra env: printenv
# - Kiểm tra files: ls -la
# - Kiểm tra process: ps aux
# - Test connection: wget http://localhost:3000/api/v1/health
```

## 8. Production Deployment

```powershell
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale backend (nếu cần)
docker-compose up -d --scale backend=3
```

## 9. Truy cập ứng dụng

- **Backend API**: http://localhost:3000/api/v1
- **Frontend**: http://localhost
- **MongoDB**: localhost:27017

## Lưu ý quan trọng

1. **MongoDB Connection**:
   - Trong Docker Compose: sử dụng `mongodb://mongodb:27017/voltech`
   - Kết nối MongoDB local: sử dụng `mongodb://host.docker.internal:27017/voltech`

2. **Environment Variables**:
   - Tạo file `.env` từ `.env.example`
   - KHÔNG commit file `.env` lên Git
   - Đảm bảo JWT_SECRET đủ mạnh trong production

3. **Networking**:
   - Backend và Frontend phải cùng network để giao tiếp
   - CORS_ORIGIN phải match với domain của frontend

4. **Security**:
   - Container chạy với non-root user
   - Health check được cấu hình
   - Chỉ expose ports cần thiết

5. **Performance**:
   - Multi-stage build để giảm image size
   - Production dependencies only
   - Node.js Alpine image (nhỏ gọn)
