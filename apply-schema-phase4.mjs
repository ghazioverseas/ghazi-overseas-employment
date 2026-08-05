import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

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

async function applyPhase4Schema() {
  console.log("=== Applying Phase 4 Extended Schema to Neon DB ===");
  try {
    // Enums
    await sql`DO $$ BEGIN
      CREATE TYPE job_status AS ENUM ('draft', 'published', 'archived');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE pipeline_stage AS ENUM ('applied', 'documents_pending', 'documents_verified', 'interview_scheduled', 'medical', 'visa_processing', 'ticket_issued', 'departure', 'completed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE interview_mode AS ENUM ('online', 'office', 'phone');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'passed', 'failed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE medical_status AS ENUM ('pending', 'passed', 'failed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE visa_status AS ENUM ('pending', 'submitted', 'approved', 'rejected');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    await sql`DO $$ BEGIN
      CREATE TYPE contact_status AS ENUM ('new', 'replied', 'archived');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`;

    // 1. Jobs Table
    await sql`CREATE TABLE IF NOT EXISTS jobs (
      id text PRIMARY KEY NOT NULL,
      slug text UNIQUE NOT NULL,
      title text NOT NULL,
      company_name text NOT NULL,
      country text NOT NULL,
      city text NOT NULL,
      industry text NOT NULL,
      trade text NOT NULL,
      employment_type text DEFAULT 'Full Time' NOT NULL,
      salary integer NOT NULL,
      currency text DEFAULT 'SAR' NOT NULL,
      contract_duration text DEFAULT '2 Years' NOT NULL,
      working_hours text DEFAULT '8 Hours/Day' NOT NULL,
      benefits text,
      food_included boolean DEFAULT true NOT NULL,
      accommodation_included boolean DEFAULT true NOT NULL,
      transport_included boolean DEFAULT true NOT NULL,
      medical_included boolean DEFAULT true NOT NULL,
      air_ticket_included boolean DEFAULT true NOT NULL,
      required_experience integer DEFAULT 2 NOT NULL,
      required_education text DEFAULT 'Matric/Intermediate' NOT NULL,
      age_limit text DEFAULT '21-45 Years',
      gender text DEFAULT 'Male',
      vacancies integer DEFAULT 10 NOT NULL,
      deadline text,
      description text NOT NULL,
      responsibilities text,
      requirements text,
      status job_status DEFAULT 'published' NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 2. Job Applications Table
    await sql`CREATE TABLE IF NOT EXISTS job_applications (
      id text PRIMARY KEY NOT NULL,
      job_id text NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      stage pipeline_stage DEFAULT 'applied' NOT NULL,
      notes text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 3. Interviews Table
    await sql`CREATE TABLE IF NOT EXISTS interviews (
      id text PRIMARY KEY NOT NULL,
      application_id text NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      job_id text NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      interview_date text NOT NULL,
      interview_time text NOT NULL,
      mode interview_mode DEFAULT 'office' NOT NULL,
      location text DEFAULT 'Ghazi Overseas Head Office, Karachi',
      notes text,
      status interview_status DEFAULT 'scheduled' NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 4. Medicals Table
    await sql`CREATE TABLE IF NOT EXISTS medicals (
      id text PRIMARY KEY NOT NULL,
      application_id text NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      status medical_status DEFAULT 'pending' NOT NULL,
      medical_date text,
      medical_center text DEFAULT 'GAMCA Approved Medical Center',
      remarks text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 5. Visas Table
    await sql`CREATE TABLE IF NOT EXISTS visas (
      id text PRIMARY KEY NOT NULL,
      application_id text NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      status visa_status DEFAULT 'pending' NOT NULL,
      visa_number text,
      issue_date text,
      expiry_date text,
      remarks text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 6. Tickets Table
    await sql`CREATE TABLE IF NOT EXISTS tickets (
      id text PRIMARY KEY NOT NULL,
      application_id text NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
      candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      airline text DEFAULT 'PIA / Saudi Arabian Airlines',
      flight_number text,
      departure_date text,
      departure_airport text DEFAULT 'Karachi (KHI)',
      arrival_airport text DEFAULT 'Riyadh (RUH)',
      pnr text,
      seat text,
      ticket_pdf_key text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 7. CMS Sections Table
    await sql`CREATE TABLE IF NOT EXISTS cms_sections (
      id text PRIMARY KEY NOT NULL,
      section_key text UNIQUE NOT NULL,
      title text NOT NULL,
      subtitle text,
      content jsonb NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 8. Contact Submissions Table
    await sql`CREATE TABLE IF NOT EXISTS contact_submissions (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      subject text NOT NULL,
      message text NOT NULL,
      status contact_status DEFAULT 'new' NOT NULL,
      reply_message text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 9. Announcements Table
    await sql`CREATE TABLE IF NOT EXISTS announcements (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      content text NOT NULL,
      target_audience text DEFAULT 'all' NOT NULL,
      is_important boolean DEFAULT false NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );`;

    // 10. Notifications Table
    await sql`CREATE TABLE IF NOT EXISTS notifications (
      id text PRIMARY KEY NOT NULL,
      user_id text NOT NULL,
      title text NOT NULL,
      message text NOT NULL,
      type text DEFAULT 'info' NOT NULL,
      is_read boolean DEFAULT false NOT NULL,
      link text,
      created_at timestamp DEFAULT now() NOT NULL
    );`;

    console.log("✓ Phase 4 Database Schema Applied Successfully to Neon DB!");
  } catch (err) {
    console.error("❌ Phase 4 Schema Migration Error:", err.message);
    process.exit(1);
  }
}

applyPhase4Schema();
