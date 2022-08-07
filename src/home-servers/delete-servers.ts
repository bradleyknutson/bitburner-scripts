import { NS } from "@ns";
/** @param {NS} ns */

export async function main(ns: NS): Promise<void> {
  const servers = ns.getPurchasedServers();
  servers.forEach((server) => {
    ns.killall(server);
    ns.deleteServer(server);
  });
}
