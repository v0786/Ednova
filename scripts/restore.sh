#!/usr/bin/env bash
# ============================================================
# EDNOVA ON-PREMISE DISASTER RECOVERY & RESTORE ENGINE
# Architecture: System State & Database Tarball Restoration
# ============================================================

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: Please specify the path to an EDNOVA backup archive (.tar.gz)."
    echo "Usage: ./scripts/restore.sh /path/to/ednova_backup_TIMESTAMP.tar.gz"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup archive file not found at: $BACKUP_FILE"
    exit 1
fi

echo "[EDNOVA RESTORE ENGINE] Starting System Restoration from: $BACKUP_FILE"
echo "[EDNOVA RESTORE ENGINE] Extracting Archive..."

tar -xzf "$BACKUP_FILE" -C /home/devpc/Projects/EDNOVA

echo "[EDNOVA RESTORE ENGINE] SUCCESS: System State Restored Successfully."
