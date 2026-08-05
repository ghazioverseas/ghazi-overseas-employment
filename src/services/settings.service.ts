import { db } from "@/lib/db";
import { adminSettings } from "@/db/schema/settings";
import { logger } from "@/lib/logger";

export class SettingsService {
  static async getPaymentSettings() {
    try {
      const result = await db.select().from(adminSettings).limit(1);
      if (result.length > 0) {
        return result[0];
      }

      // Default fallback if table was empty
      return {
        id: "default_settings",
        companyName: "Ghazi Overseas Employment Pakistan",
        companyWebsite: "https://ghazioverseas.pk",
        companyAddress: "Karachi / Islamabad Commercial Zone, Pakistan",
        companyPhone: "+92 (021) 111-GHAZI-0",
        companyEmail: "info@ghazioverseas.pk",
        bankName: "Meezan Bank Limited",
        accountTitle: "Ghazi Overseas Employment Pakistan",
        accountNumber: "0102030405060708",
        iban: "PK36MEZN0001020304050607",
        showBank: true,
        easypaisaNumber: "03001234567",
        easypaisaTitle: "Ghazi Overseas Employment",
        showEasypaisa: true,
        jazzcashNumber: "03011234567",
        jazzcashTitle: "Ghazi Overseas Employment",
        showJazzcash: true,
        submissionFee: 500,
        isSubmissionFeeEnabled: true,
        autoDeleteDays: 30,
        maxUploadSizeMb: 10,
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch admin payment settings", { error: errMessage });
      return {
        id: "default_settings",
        companyName: "Ghazi Overseas Employment Pakistan",
        companyWebsite: "https://ghazioverseas.pk",
        companyAddress: "Karachi / Islamabad Commercial Zone, Pakistan",
        companyPhone: "+92 (021) 111-GHAZI-0",
        companyEmail: "info@ghazioverseas.pk",
        bankName: "Meezan Bank Limited",
        accountTitle: "Ghazi Overseas Employment Pakistan",
        accountNumber: "0102030405060708",
        iban: "PK36MEZN0001020304050607",
        showBank: true,
        easypaisaNumber: "03001234567",
        easypaisaTitle: "Ghazi Overseas Employment",
        showEasypaisa: true,
        jazzcashNumber: "03011234567",
        jazzcashTitle: "Ghazi Overseas Employment",
        showJazzcash: true,
        submissionFee: 500,
        isSubmissionFeeEnabled: true,
        autoDeleteDays: 30,
        maxUploadSizeMb: 10,
      };
    }
  }
}
