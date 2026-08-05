import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

// Parse .env.local file
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const parts = trimmed.split("=");
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      process.env[key] = val;
    }
  });
}

const sql = neon(process.env.DATABASE_URL);

async function seedSuperAdmin() {
  console.log("=== Seeding Default Super Admin Account ===");
  try {
    const adminEmail = "admin@ghazioverseas.com";
    
    // 1. Check if super admin user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1;`;

    if (existing.length > 0) {
      console.log(`✓ Super Admin account ${adminEmail} already exists in database.`);
      await sql`UPDATE users SET role = 'admin' WHERE email = ${adminEmail};`;
      return;
    }

    const adminUserId = "admin_super_user_id";
    const now = new Date().toISOString();

    // 2. Insert User with role="admin"
    await sql`INSERT INTO users (id, name, email, email_verified, role, created_at, updated_at) 
      VALUES (${adminUserId}, 'Ghazi Super Admin', ${adminEmail}, true, 'admin', ${now}, ${now});`;

    // 3. Create Account entry for password login
    const accountId = "account_super_admin_id";
    // Scrypt hashed representation for 'Admin@12345'
    const passwordHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

    await sql`INSERT INTO accounts (id, user_id, account_id, provider_id, access_token, created_at, updated_at) 
      VALUES (${accountId}, ${adminUserId}, ${adminEmail}, 'credential', ${passwordHash}, ${now}, ${now});`;

    console.log(`✓ Super Admin created successfully: ${adminEmail} (Role: admin)`);
  } catch (err) {
    console.error("❌ Super Admin Seeding Error:", err.message);
    process.exit(1);
  }
}

seedSuperAdmin();
