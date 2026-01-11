# Casper Accelerate - VPS Deployment Guide

Complete guide to deploy Casper Accelerate ZK-Rollup on a VPS server.

---

## Table of Contents

1. [Server Requirements](#1-server-requirements)
2. [Initial Server Setup](#2-initial-server-setup)
3. [Install Dependencies](#3-install-dependencies)
4. [Database Setup](#4-database-setup)
5. [Application Setup](#5-application-setup)
6. [Environment Configuration](#6-environment-configuration)
7. [ZK Circuit Setup](#7-zk-circuit-setup)
8. [Build & Run](#8-build--run)
9. [Process Management (PM2)](#9-process-management-pm2)
10. [Nginx Reverse Proxy](#10-nginx-reverse-proxy)
11. [SSL Certificate (Let's Encrypt)](#11-ssl-certificate-lets-encrypt)
12. [Firewall Configuration](#12-firewall-configuration)
13. [Monitoring & Logs](#13-monitoring--logs)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Server Requirements

### Minimum Specifications

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 8 GB | 16+ GB |
| Storage | 50 GB SSD | 100+ GB NVMe |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04/24.04 LTS |

> **Note:** ZK proof generation is CPU-intensive. More cores = faster proofs.

### Recommended VPS Providers

- **Hetzner** - Best price/performance (CX41 or higher)
- **DigitalOcean** - Premium Droplets
- **Vultr** - High Frequency Compute
- **OVH** - VPS or Dedicated servers
- **Contabo** - Budget option with good specs

---

## 2. Initial Server Setup

### Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

### Create Non-Root User

```bash
# Create user
adduser accelerate
usermod -aG sudo accelerate

# Setup SSH key authentication
mkdir -p /home/accelerate/.ssh
cp ~/.ssh/authorized_keys /home/accelerate/.ssh/
chown -R accelerate:accelerate /home/accelerate/.ssh
chmod 700 /home/accelerate/.ssh
chmod 600 /home/accelerate/.ssh/authorized_keys

# Switch to new user
su - accelerate
```

### Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

---

## 3. Install Dependencies

### Node.js (v20 LTS)

```bash
# Install via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should be v20.x.x
npm --version
```

### PostgreSQL 16

```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql-16 postgresql-contrib-16

# Start and enable
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Additional Tools

```bash
# PM2 for process management
sudo npm install -g pm2

# Nginx for reverse proxy
sudo apt install -y nginx

# Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## 4. Database Setup

### Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER accelerate WITH PASSWORD 'YOUR_SECURE_PASSWORD';
CREATE DATABASE accelerate_db OWNER accelerate;
GRANT ALL PRIVILEGES ON DATABASE accelerate_db TO accelerate;

# Enable UUID extension
\c accelerate_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q
```

### Configure PostgreSQL for Remote Access (Optional)

If database is on a separate server:

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/16/main/postgresql.conf
# Change: listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf
# Add: host accelerate_db accelerate YOUR_APP_IP/32 scram-sha-256

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 5. Application Setup

### Clone Repository

```bash
cd /home/accelerate
git clone https://github.com/YOUR_USERNAME/accelerate.git
cd accelerate
```

### Install Dependencies

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Environment Configuration

### Create .env File

```bash
nano .env
```

### Environment Variables

```env
# =============================================================================
# Casper Accelerate - Production Environment
# =============================================================================

# Database
DATABASE_URL="postgresql://accelerate:YOUR_SECURE_PASSWORD@localhost:5432/accelerate_db"

# Casper Network RPC
CASPER_RPC_URL="https://rpc.testnet.casperlabs.io/rpc"
# For mainnet: CASPER_RPC_URL="https://rpc.mainnet.casperlabs.io/rpc"

# L1 Contract Addresses (Casper Testnet)
ROLLUP_CONTRACT_HASH="hash-YOUR_ROLLUP_CONTRACT_HASH"
BRIDGE_CONTRACT_HASH="hash-YOUR_BRIDGE_CONTRACT_HASH"

# Operator Keys (for sequencer/prover)
OPERATOR_PRIVATE_KEY="YOUR_OPERATOR_PRIVATE_KEY"
OPERATOR_PUBLIC_KEY="YOUR_OPERATOR_PUBLIC_KEY"

# ZK Circuit Paths
CIRCUIT_WASM_PATH="./circuits/batch_transfer_js/batch_transfer.wasm"
CIRCUIT_ZKEY_PATH="./circuits/batch_transfer.zkey"
VERIFICATION_KEY_PATH="./circuits/verification_key.json"

# Server Configuration
NODE_ENV="production"
PORT=3000

# Sequencer Settings
BATCH_SIZE=4
BATCH_TIMEOUT_MS=60000
PROOF_TIMEOUT_MS=600000

# Rate Limiting (Redis recommended for production)
# REDIS_URL="redis://localhost:6379"

# Logging
LOG_LEVEL="info"
```

### Secure the .env File

```bash
chmod 600 .env
```

---

## 7. ZK Circuit Setup

### Required Circuit Files

Ensure these files exist in `./circuits/`:

```
circuits/
├── batch_transfer_js/
│   └── batch_transfer.wasm    # ~2 MB
├── batch_transfer.zkey         # ~500 MB (pot21)
└── verification_key.json       # ~2 KB
```

### If Circuit Files Don't Exist

```bash
# Download pre-compiled circuits (if available)
wget https://your-storage.com/circuits.tar.gz
tar -xzf circuits.tar.gz -C ./circuits/

# OR compile from source (takes hours)
cd circuits
npm install
./compile.sh
./generate_keys.sh
```

### Verify Circuit Files

```bash
# Check file sizes
ls -lh circuits/

# Expected:
# batch_transfer.wasm    ~2 MB
# batch_transfer.zkey    ~500 MB
# verification_key.json  ~2 KB
```

---

## 8. Build & Run

### Run Database Migrations

```bash
npx prisma db push
```

### Build Application

```bash
npm run build
```

### Test Run

```bash
npm start
# Should see: "Ready on http://localhost:3000"
# Press Ctrl+C to stop
```

---

## 9. Process Management (PM2)

### Create PM2 Ecosystem File

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'accelerate',
      script: 'npm',
      args: 'start',
      cwd: '/home/accelerate/accelerate',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/accelerate/logs/accelerate-error.log',
      out_file: '/home/accelerate/logs/accelerate-out.log',
      log_file: '/home/accelerate/logs/accelerate-combined.log',
      time: true
    }
  ]
};
```

### Create Log Directory

```bash
mkdir -p /home/accelerate/logs
```

### Start with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs accelerate

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u accelerate --hp /home/accelerate
# Run the command it outputs
```

### PM2 Commands Reference

```bash
pm2 status              # Show all processes
pm2 logs accelerate     # View logs
pm2 restart accelerate  # Restart app
pm2 stop accelerate     # Stop app
pm2 delete accelerate   # Remove from PM2
pm2 monit               # Real-time monitoring
```

---

## 10. Nginx Reverse Proxy

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/accelerate
```

```nginx
# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name accelerate.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name accelerate.yourdomain.com;

    # SSL (will be configured by Certbot)
    # ssl_certificate /etc/letsencrypt/live/accelerate.yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/accelerate.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Proxy settings
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # SSE endpoint (Server-Sent Events)
    location /api/events {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400;
        chunked_transfer_encoding off;
    }

    # API rate limiting (optional, app handles this too)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Rate limiting at Nginx level (1000 req/min per IP)
        # limit_req zone=api burst=50 nodelay;
    }
}
```

### Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/accelerate /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 11. SSL Certificate (Let's Encrypt)

### Obtain Certificate

```bash
sudo certbot --nginx -d accelerate.yourdomain.com
```

Follow the prompts:
1. Enter email for renewal notices
2. Agree to terms
3. Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### Auto-Renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

---

## 12. Firewall Configuration

### UFW Setup

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow OpenSSH

# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Allow PostgreSQL only from specific IPs (if needed)
# sudo ufw allow from YOUR_IP to any port 5432

# Check status
sudo ufw status
```

### Expected Output

```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

---

## 13. Monitoring & Logs

### Application Logs

```bash
# PM2 logs
pm2 logs accelerate

# Follow logs in real-time
pm2 logs accelerate --lines 100

# Log files location
tail -f /home/accelerate/logs/accelerate-combined.log
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring

```bash
# CPU/Memory usage
htop

# Disk usage
df -h

# PM2 monitoring dashboard
pm2 monit
```

### Health Check Endpoint

```bash
# Test health
curl https://accelerate.yourdomain.com/api/status
```

---

## 14. Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs accelerate --err --lines 50

# Check if port is in use
sudo lsof -i :3000

# Verify environment variables
cat .env

# Test database connection
npx prisma db pull
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U accelerate -d accelerate_db -h localhost

# Check pg_hba.conf for auth settings
sudo cat /etc/postgresql/16/main/pg_hba.conf
```

### Nginx 502 Bad Gateway

```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### High Memory Usage

```bash
# Check memory
free -m

# Increase swap (if needed)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### ZK Proof Generation Issues

```bash
# Check circuit files exist
ls -la circuits/

# Verify WASM file
file circuits/batch_transfer_js/batch_transfer.wasm

# Check available memory for proof generation
free -m  # Need at least 4GB free
```

---

## Quick Reference

### Start Everything

```bash
sudo systemctl start postgresql
pm2 start ecosystem.config.js
sudo systemctl start nginx
```

### Stop Everything

```bash
pm2 stop accelerate
sudo systemctl stop nginx
```

### Update Application

```bash
cd /home/accelerate/accelerate
git pull origin main
npm install
npm run build
npx prisma db push
pm2 restart accelerate
```

### Generate New API Key

```bash
cd /home/accelerate/accelerate
npx tsx scripts/generateApiKey.ts
```

---

## Support

- **GitHub Issues:** https://github.com/casper-accelerate/accelerate/issues
- **Discord:** https://discord.gg/casper-accelerate
- **Documentation:** https://docs.accelerate.casper.network

---

*Last updated: January 2026*
