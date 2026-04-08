import { WalletService } from "../services/WalletService";

const walletService = new WalletService();

/**
 * Initialize background tasks for the wallet system.
 * This will run once every 24 hours (or at custom intervals).
 */
export const initWalletTasks = () => {
  console.log("[WalletCron] Initializing activation scheduler...");

  // Run once on startup (optional, let's wait 1 min)
  setTimeout(() => runActivation(), 60 * 1000);

  // Schedule to run every 24 hours
  // (24 * 60 * 60 * 1000)
  setInterval(
    () => {
      runActivation();
    },
    24 * 60 * 60 * 1000,
  );
};

const runActivation = async () => {
  try {
    console.log("[WalletCron] Running pending coin activations...");
    const count = await walletService.activatePendingCoins();
    console.log(
      `[WalletCron] Activation complete. Processed ${count} transactions.`,
    );
  } catch (error) {
    console.error("[WalletCron] Activation cycle failed:", error);
  }
};
