# Setting Up PostgreSQL Databases on Windows

## 🚀 Quick Setup

### Option 1: Use Setup Script (Easiest!)

**PowerShell:**
```powershell
cd backend-api
.\setup-databases.ps1
```

**Command Prompt:**
```batch
cd backend-api
setup-databases.bat
```

The script will:
- Check if PostgreSQL is installed
- Prompt for your PostgreSQL password
- Create the Proverbs database automatically

---

### Option 2: Manual Setup

**Step 1: Open PostgreSQL Command Line**

1. Press `Windows Key`
2. Type "SQL Shell (psql)"
3. Press Enter

**Step 2: Connect**

When prompted:
- Server: Press Enter (default: localhost)
- Database: Press Enter (default: postgres)
- Port: Press Enter (default: 5432)
- Username: Press Enter (default: postgres)
- Password: Enter your PostgreSQL password

**Step 3: Create Databases**

```sql
CREATE DATABASE proverbs_book;
```

**Step 4: Verify**

```sql
\l
```

You should see the database listed.

**Step 5: Exit**

```sql
\q
```

---

### Option 3: Using pgAdmin (GUI)

1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click **Databases** → **Create** → **Database**
4. Name: `proverbs_book` → **Save**

---

## 🔧 Troubleshooting

### PostgreSQL Not Found

**Problem:** `psql` command not recognized

**Solution:**
1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to PATH:
   - Right-click **This PC** → **Properties**
   - **Advanced system settings**
   - **Environment Variables**
   - Edit **Path** variable
   - Add: `C:\Program Files\PostgreSQL\15\bin`
   - Click **OK**
3. Restart PowerShell/Command Prompt

### Connection Refused

**Problem:** Can't connect to PostgreSQL

**Solution:**
1. Check if PostgreSQL service is running:
   - Press `Windows Key` + R
   - Type `services.msc`
   - Find **postgresql-x64-15** (or similar)
   - Right-click → **Start** if stopped

### Wrong Password

**Problem:** Authentication failed

**Solution:**
- Use the password you set during PostgreSQL installation
- If you forgot, you may need to reset it or reinstall PostgreSQL

---

## ✅ Verify Setup

After creating databases, verify:

```powershell
psql -U postgres -l
```

You should see:
- `proverbs_book`

---

## 📝 Next Steps

1. ✅ Databases created
2. Configure `.env` file:
   - `backend-api/.env`
3. Install dependencies:
   ```bash
   cd backend-api
   npm install
   ```
4. Start server:
   ```bash
   cd backend-api
   npm start
   ```

---

## 🎯 Quick Reference

**Create database manually:**
```bash
psql -U postgres
CREATE DATABASE proverbs_book;
\q
```

**List databases:**
```bash
psql -U postgres -l
```

**Connect to database:**
```bash
psql -U postgres -d proverbs_book
```
