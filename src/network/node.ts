// src/network/node.ts

import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayServer } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { createLibp2p, type Libp2p } from "libp2p";
import { getPrivateKey } from "../util/util.js";
import type { Multiaddr } from "@multiformats/multiaddr";
import { log } from "../util/log.js";

export class Node {
  private node: Libp2p;

  private constructor(nodeInstance: Libp2p) {
    this.node = nodeInstance;

    this.node.addEventListener("peer:discovery", (evt) => {
      log("INFO", `Discovered: ${evt.detail.id.toString()}`);
    });

    this.node.addEventListener("connection:open", (evt) => {
      const remoteAddr = evt.detail.remoteAddr.toString();
      log("INFO", `Connection established with: ${remoteAddr}`);
    });
  }

  static async init() {
    const announceDns: string = process.env.PUBLIC_DNS || "locahost";

    const node = await createLibp2p({
      privateKey: await getPrivateKey(),
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/4002/wss", "/ip4/0.0.0.0/tcp/4001"],
        announce: [
          `/dns4/${announceDns}/tcp/4001`,
          `/dns4/${announceDns}/tcp/4002/wss`,
        ],
      },
      transports: [webSockets()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      services: {
        identify: identify(),
        relay: circuitRelayServer(),
      },
    });
    return new Node(node);
  }

  async stop() {
    await this.node.stop();
  }

  async getMultiAddresses(): Promise<Multiaddr[]> {
    return this.node.getMultiaddrs();
  }
}
