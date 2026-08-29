#!/usr/bin/env bash
# ==============================================================================
# Furniture Workshop Production Server Setup Script (Ubuntu 24.04 LTS)
# ==============================================================================
# Usage: sudo bash deploy/setup-server.sh
# NOTE: Executed on target Contabo VPS server during Phase 18 setup.
# ==============================================================================

set -euo pipefail

echo "[1/8] Updating System Packages..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw fail2ban logrotate postgresql-16 postgresql-contrib-16 nginx

echo "[2/8] Creating Dedicated Application User 'furniture'..."
if ! id "furniture" &>/dev/null; then
    useradd -m -s /bin/bash furniture
fi

echo "[3/8] Setting Up Production Directory Structure..."
mkdir -p /srv/furniture-workshop/{app,env,logs,backups}
chown -R furniture:furniture /srv/furniture-workshop
chmod 750 /srv/furniture-workshop
chmod 700 /srv/furniture-workshop/env
chmod 700 /srv/furniture-workshop/backups

echo "[4/8] Installing Node.js 24 LTS..."
if ! command -v node &>/dev/null || [[ $(node -v | cut -d'.' -f1) != "v24" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
    apt-get install -y nodejs
fi

echo "[5/8] Configuring PostgreSQL 16 (Localhost Binding Only)..."
systemctl enable postgresql
systemctl start postgresql

# Ensure PostgreSQL listens ONLY on localhost
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/16/main/postgresql.conf

# Create dedicated DB user & database if not existing
sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'furniture_app') THEN CREATE ROLE furniture_app WITH LOGIN PASSWORD 'change_in_env_file'; END IF; END \$\$;"
sudo -u postgres psql -c "SELECT 'CREATE DATABASE furniture_workshop WITH OWNER furniture_app' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'furniture_workshop')\gexec"

systemctl restart postgresql

echo "[6/8] Configuring UFW Firewall..."
ufw default deny inbound
ufw default allow outbound
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

echo "[7/8] Installing Systemd Services..."
cp deploy/systemd/furniture-backend.service /etc/systemd/system/
cp deploy/systemd/furniture-frontend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable furniture-backend.service
systemctl enable furniture-frontend.service

echo "[8/8] Installing Nginx Configuration Template..."
cp deploy/nginx/furniture-workshop.conf /etc/nginx/sites-available/furniture-workshop
ln -sf /etc/nginx/sites-available/furniture-workshop /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=============================================================================="
echo "Production Server Environment Infrastructure READY!"
echo "Next Steps: Populate /srv/furniture-workshop/env/*.env files and run migrations."
echo "=============================================================================="
