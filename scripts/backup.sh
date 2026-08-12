#!/bin/sh
# Sao lưu MongoDB tự động mỗi ngày, giữ lại RETENTION_DAYS bản gần nhất.
# Chạy liên tục bên trong container mongo-backup (xem docker-compose.yml).

MONGO_URI="mongodb://mongo:27017/congdoan_portal"
BACKUP_DIR="/backups"
RETENTION_DAYS=14
INTERVAL_SECONDS=86400 # 24 giờ

mkdir -p "$BACKUP_DIR"

echo "[Backup] Dịch vụ sao lưu MongoDB đã khởi động. Thư mục lưu: $BACKUP_DIR"

while true; do
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  DEST="$BACKUP_DIR/congdoan_$TIMESTAMP"

  echo "[Backup] Bắt đầu sao lưu lúc $TIMESTAMP..."
  if mongodump --uri="$MONGO_URI" --out="$DEST" --gzip; then
    echo "[Backup] Hoàn tất: $DEST"
  else
    echo "[Backup] LỖI: sao lưu thất bại lúc $TIMESTAMP"
  fi

  # Xoá các bản sao lưu cũ hơn RETENTION_DAYS ngày
  find "$BACKUP_DIR" -maxdepth 1 -name "congdoan_*" -type d -mtime "+$RETENTION_DAYS" -exec rm -rf {} \;

  sleep "$INTERVAL_SECONDS"
done
