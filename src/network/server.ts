// src/network/server.ts

import { validateConfigFile } from "../config/config.js";
import { log } from "../util/log.js";
import { Node } from "./node.js";

export class Server {
  private node: Node;

  public constructor(node: Node) {
    this.node = node;
  }

  static async init() {
    await log("INFO", "Validating config file...");
    console.log("Validating config file...");

    await validateConfigFile();

    await log("INFO", "Config file validated.");
    console.log("Config file validated.");

    await log("INFO", "Initializing server...");
    console.log("Initializing server...");

    const node = await Node.init();

    await log("INFO", "Server initialized.");
    console.log("Server initialized.");

    return new Server(node);
  }

  async stop() {
    await log("INFO", "Stopping node...");
    console.log("Stopping node...");
    await this.node.stop();
    await log("INFO", "Node stopped.");
    console.log("Node stopped.");
  }

  async printAddresses() {
    console.log("Printing addresses...");
    const addresses = await this.node.getMultiAddresses();
    addresses.forEach((addr) => console.log(addr.toString()));
  }
}
