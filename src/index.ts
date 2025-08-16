// src/index.ts

import 'dotenv/config';
import { Server } from './network/server.js';

const server : Server = await Server.init();
await server.printAddresses();

process.on("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await server.stop();
  process.exit(0);
});