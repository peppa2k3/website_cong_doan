#!/bin/sh
# Khôi phục dữ liệu MongoDB từ một bản sao lưu.
# Sử dụng: ./scripts/restore.sh backups/congdoan_20260101_020000
#
# Script này chạy TỪ MÁY HOST (không phải trong container), yêu cầu đã cài mongodb-database-tools,
# HOẶC chạy thông qua container tạm thời như bên dưới:
#
#   docker run --rm --network congdoan-portal_congdoan-net \
#     -v "$(pwd)/backups:/backups" mongo:6.0 \
#     mongorestore --uri="mongodb://mongo:27017/congdoan_portal" --gzip --drop /backups/congdoan_20260101_020000/congdoan_portal

set -e

if [ -z "$1" ]; then
  echo "Cách dùng: $0 <đường-dẫn-thư-mục-backup>"
  exit 1
fi

BACKUP_PATH="$1"

echo "Đang khôi phục từ: $BACKUP_PATH"
echo "CẢNH BÁO: thao tác này sẽ ghi đè (--drop) dữ liệu hiện tại trong database congdoan_portal."
read -p "Tiếp tục? (y/N) " confirm
if [ "$confirm" != "y" ]; then
  echo "Đã huỷ."
  exit 0
fi

docker run --rm --network congdoan-portal_congdoan-net \
  -v "$(pwd)/backups:/backups" mongo:6.0 \
  mongorestore --uri="mongodb://mongo:27017/congdoan_portal" --gzip --drop "/${BACKUP_PATH}/congdoan_portal"

echo "Khôi phục hoàn tất."
