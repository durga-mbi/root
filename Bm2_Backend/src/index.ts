import "module-alias/register";
import "reflect-metadata";
import { createServer } from "./server";
import config from "./config";
import { initWalletTasks } from "./tasks/WalletCron";

const server = createServer();

// Start background tasks
initWalletTasks();

server.listen(config.port, "0.0.0.0", () => {
  console.log(`api running on ${config.port}`);
});
