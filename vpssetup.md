# VPS PostgreSQL Setup for Accelerate

## Prerequisites
- Ubuntu 22.04+ VPS
- Minimum 1GB RAM, 25GB SSD
- Root/sudo access

---

## Step 1: Install PostgreSQL

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Step 2: Create Database and User

```bash
sudo -u postgres psql
```

```sql
CREATE USER accelerate WITH PASSWORD 'CHANGE_THIS_PASSWORD';
CREATE DATABASE accelerate_db OWNER accelerate;
GRANT ALL PRIVILEGES ON DATABASE accelerate_db TO accelerate;
\q
```

---

## Step 3: Configure Remote Access

Edit PostgreSQL config:
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Change:
```
listen_addresses = '*'
```

Edit pg_hba.conf:
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Add at the end:
```
host    accelerate_db    accelerate    0.0.0.0/0    scram-sha-256
```

Restart:
```bash
sudo systemctl restart postgresql
```

---

## Step 4: Configure Firewall

```bash
sudo ufw allow 5432/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## Step 5: Connection String

```
DATABASE_URL=postgresql://accelerate:CHANGE_THIS_PASSWORD@YOUR_VPS_IP:5432/accelerate_db
```

---

## Step 6: Add to Vercel

```bash
vercel env add DATABASE_URL production
# Paste: postgresql://accelerate:password@vps_ip:5432/accelerate_db
vercel --prod
```

---

## Step 7: Run Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

---

## Generate Secure Password

```bash
openssl rand -base64 32
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Check `sudo ufw status` and `listen_addresses` |
| Auth failed | Verify pg_hba.conf and password |
| DB not found | Run `sudo -u postgres createdb accelerate_db` |
