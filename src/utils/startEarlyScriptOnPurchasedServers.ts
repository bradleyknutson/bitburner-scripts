import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const purchasedServers = ns.getPurchasedServers();

  for (const server of purchasedServers) {
    const totalRam = ns.getServerMaxRam(server);
    const usedRam = ns.getServerUsedRam(server) + 6;
    const threads = Math.floor(
      (totalRam - usedRam) / ns.getScriptRam("/scripts/early-hack-template.js")
    );
    if (threads > 0) {
      ns.exec("/scripts/early-hack-template.js", server, threads);
    }
  }
}
