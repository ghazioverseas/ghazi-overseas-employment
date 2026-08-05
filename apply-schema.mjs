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

async function applySchemaUpdates() {
  console.log("=== Applying Extended Schema Updates to Neon DB ===");
  try {
    // 1. Enums
    await sql`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending_payment', 'payment_under_review', 'approved', 'rejected');
      END IF;
    END $$;`;

    await sql`ALTER TYPE candidate_status ADD VALUE IF NOT EXISTS 'awaiting_payment_verification';`;
    await sql`ALTER TYPE candidate_status ADD VALUE IF NOT EXISTS 'approved';`;

    // 2. Candidates Columns
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS full_name text NOT NULL DEFAULT '';`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS father_name text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS date_of_birth text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS whatsapp text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS address text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS city text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS province text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS country text DEFAULT 'Pakistan';`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS profession text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS years_of_experience integer DEFAULT 0;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS education text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending_payment' NOT NULL;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS transaction_ref text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS payment_proof_key text;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS submission_fee integer DEFAULT 500 NOT NULL;`;

    // 3. Admin Settings Table
    await sql`CREATE TABLE IF NOT EXISTS admin_settings (
      id text PRIMARY KEY NOT NULL,
      bank_name text DEFAULT 'Meezan Bank Limited' NOT NULL,
      account_title text DEFAULT 'Ghazi Overseas Employment Pakistan' NOT NULL,
      account_number text DEFAULT '0102030405060708' NOT NULL,
      iban text DEFAULT 'PK36MEZN0001020304050607' NOT NULL,
      easypaisa_number text DEFAULT '03001234567' NOT NULL,
      easypaisa_title text DEFAULT 'Ghazi Overseas Employment' NOT NULL,
      jazzcash_number text DEFAULT '03011234567' NOT NULL,
      jazzcash_title text DEFAULT 'Ghazi Overseas Employment' NOT NULL,
      submission_fee integer DEFAULT 500 NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // Seed default admin settings if empty
    const existingSettings = await sql`SELECT id FROM admin_settings LIMIT 1;`;
    if (existingSettings.length === 0) {
      await sql`INSERT INTO admin_settings (
        id, bank_name, account_title, account_number, iban, 
        easypaisa_number, easypaisa_title, jazzcash_number, jazzcash_title, submission_fee
      ) VALUES (
        'default_settings', 'Meezan Bank Limited', 'Ghazi Overseas Employment Pakistan',
        '0102030405060708', 'PK36MEZN0001020304050607',
        '03001234567', 'Ghazi Overseas Employment',
        '03011234567', 'Ghazi Overseas Employment', 500
      );`;
      console.log("✓ Default Admin Payment Settings Seeded into Neon DB.");
    }

    console.log("✓ Extended Database Schema Applied Successfully to Neon DB!");
  } catch (err) {
    console.error("❌ Schema update error:", err.message);
    process.exit(1);
  }
}

applySchemaUpdates();
