import * as cron from "node-cron";
import { inocomeGenerateUsecase } from "../useCase/income.generate.usecase";
import fs from "fs";
import path from "path";

// Schedule at 11:05 AM every day
cron.schedule("1 0 * * *", async () => {
    console.log("Starting daily income generation at 11:05 AM...");
    try {
        const result = await inocomeGenerateUsecase();

        // Ensure downloads directory exists
        const downloadsDir = path.join(process.cwd(), "downloads");
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        // Export result to JSON file with timestamp
        const fileName = `income-report-${new Date().toISOString().replace(/:/g, "-")}.json`;
        const filePath = path.join(downloadsDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

        console.log(`Income generation completed. Report saved to: ${filePath}`);
    } catch (error) {
        console.error("Critical error in daily income generation cron job:", error);
    }
});
