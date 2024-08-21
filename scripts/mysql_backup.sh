#!/bin/bash

# 1.设置脚本权限
# chmod +x /var/www/script/mysql_backup.sh
# 2.配置crob权限
# crontab -e
# 3.添加定时任务
# 0 2 * * * /var/www/script/mysql_backup.sh

# 配置部分
BACKUP_DIR="/var/www/backup"  # 备份文件存储路径
MYSQL_USER="root"  # MySQL 用户名
MYSQL_PASSWORD="your_mysql_password"  # MySQL 密码
MYSQL_HOST="localhost"  # MySQL 主机
MYSQL_PORT="3306"  # MySQL 端口
DATE=$(date +"%Y-%m-%d_%H-%M-%S")  # 获取当前日期时间
BACKUP_FILE="$BACKUP_DIR/mysql_backup_$DATE.sql"  # 备份文件的名称

# 创建备份目录（如果不存在）
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_HOST -P $MYSQL_PORT --all-databases > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] MySQL backup successful: $BACKUP_FILE" >> $BACKUP_DIR/backup.log
else
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] MySQL backup failed!" >> $BACKUP_DIR/backup.log
    exit 1
fi

# 删除30天以前的备份文件
find $BACKUP_DIR -name "mysql_backup_*.sql" -type f -mtime +30 -exec rm -f {} \;

# 记录删除操作结果
if [ $? -eq 0 ]; then
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Old backups deleted successfully." >> $BACKUP_DIR/backup.log
else
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Failed to delete old backups." >> $BACKUP_DIR/backup.log
fi