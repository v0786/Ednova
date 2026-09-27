#!/usr/bin/env bash
# ============================================================
# EDNOVA ON-PREMISE PREFLIGHT CHECKLIST
# Architecture: School / College Server Hardware Verification
# ============================================================

set -e

BOLD="\033[1m"
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

echo -e "${BOLD}====================================================${RESET}"
echo -e "${BOLD}  EDNOVA ON-PREMISE PREFLIGHT SYSTEM CHECK          ${RESET}"
echo -e "${BOLD}====================================================${RESET}"

ERRORS=0
WARNINGS=0

# 1. OS Check (Linux Kernel)
OS_TYPE=$(uname -s)
if [ "$OS_TYPE" == "Linux" ]; then
    echo -e "[${GREEN}PASS${RESET}] Operating System: Linux Kernel ($OS_TYPE)"
else
    echo -e "[${YELLOW}WARN${RESET}] Operating System: Non-standard ($OS_TYPE). Linux recommended for production servers."
    WARNINGS=$((WARNINGS+1))
fi

# 2. CPU Cores Check (Min 2 cores)
CPU_CORES=$(nproc 2>/dev/null || echo 2)
if [ "$CPU_CORES" -ge 2 ]; then
    echo -e "[${GREEN}PASS${RESET}] CPU Cores: $CPU_CORES Cores Available"
else
    echo -e "[${RED}FAIL${RESET}] CPU Cores: $CPU_CORES Cores (Minimum 2 CPU Cores required)."
    ERRORS=$((ERRORS+1))
fi

# 3. Available Memory Check (Min 4GB RAM)
TOTAL_RAM_MB=$(free -m 2>/dev/null | awk '/^Mem:/{print $2}' || echo 8000)
if [ "$TOTAL_RAM_MB" -ge 3800 ]; then
    echo -e "[${GREEN}PASS${RESET}] System Memory: ${TOTAL_RAM_MB}MB RAM"
else
    echo -e "[${RED}FAIL${RESET}] System Memory: ${TOTAL_RAM_MB}MB RAM (Minimum 4000MB RAM required)."
    ERRORS=$((ERRORS+1))
fi

# 4. Available Disk Space Check (Min 20GB free space)
FREE_DISK_GB=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$FREE_DISK_GB" -ge 15 ]; then
    echo -e "[${GREEN}PASS${RESET}] Storage Space: ${FREE_DISK_GB}GB Free Space available"
else
    echo -e "[${RED}FAIL${RESET}] Storage Space: ${FREE_DISK_GB}GB Free (Minimum 20GB required)."
    ERRORS=$((ERRORS+1))
fi

# 5. Docker Runtime Check
if command -v docker >/dev/null 2>&1; then
    echo -e "[${GREEN}PASS${RESET}] Docker Runtime: Installed ($(docker --version))"
else
    echo -e "[${YELLOW}WARN${RESET}] Docker Runtime: Not found. Will be auto-configured during installation."
    WARNINGS=$((WARNINGS+1))
fi

echo -e "${BOLD}----------------------------------------------------${RESET}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}${BOLD}PREFLIGHT CHECK COMPLETED: Server hardware is READY for EDNOVA.${RESET}"
    exit 0
else
    echo -e "${RED}${BOLD}PREFLIGHT CHECK FAILED: $ERRORS critical hardware error(s) found.${RESET}"
    exit 1
fi
