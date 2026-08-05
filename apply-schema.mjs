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

async function applyPhase3SchemaUpdates() {
  console.log("=== Applying Extended Schema Updates to Neon DB ===");
  try {
    // 1. Better Auth Accounts Columns (password, id_token, scope, etc.)
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS password text;`;
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS id_token text;`;
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS access_token_expires_at timestamp;`;
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS refresh_token_expires_at timestamp;`;
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS scope text;`;

    // 2. Extended Admin Settings Columns
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS company_name text DEFAULT 'Ghazi Overseas Employment Pakistan' NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS company_website text DEFAULT 'https://ghazioverseas.pk' NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS company_address text DEFAULT 'Karachi / Islamabad Commercial Zone, Pakistan' NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS company_phone text DEFAULT '+92 (021) 111-GHAZI-0' NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS company_email text DEFAULT 'info@ghazioverseas.pk' NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS is_submission_fee_enabled boolean DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS show_bank boolean DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS show_easypaisa boolean DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS show_jazzcash boolean DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS auto_delete_days integer DEFAULT 30 NOT NULL;`;
    await sql`ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS max_upload_size_mb integer DEFAULT 10 NOT NULL;`;

    // 3. Application Notes Table
    await sql`CREATE TABLE IF NOT EXISTS application_notes (
      id text PRIMARY KEY NOT NULL,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      admin_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      admin_name text NOT NULL,
      note text NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    console.log("✓ Database Schema Updates Applied Successfully to Neon DB!");
  } catch (err) {
    console.error("❌ Schema Update Error:", err.message);
    process.exit(1);
  }
}

applyPhase3SchemaUpdates();
