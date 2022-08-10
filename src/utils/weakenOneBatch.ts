import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const node = ns.args[0];
  const growFile = "/scripts/batchThePlanet/grow.js";
  const weakenFile = "/scripts/batchThePlanet/weaken.js";
  const growRAM = ns.getScriptRam(growFile);
  const weakenRAM = ns.getScriptRam(weakenFile);

  if (typeof node !== "string") return;
  const servers = [...ns.getPurchasedServers().reverse()];
  for (const server of servers) {
    const maxGrowThreads = Math.floor(
      (ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / growRAM / 2
    );
    const maxWeakenThreads = Math.floor(
      (ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / weakenRAM / 2
    );

    const growWaitTime = Math.ceil(
      ns.getWeakenTime(node) - ns.getGrowTime(node)
    );
    ns.exec(weakenFile, server, maxWeakenThreads, 1000, node);
    ns.exec(growFile, server, maxGrowThreads, growWaitTime, node);
    await ns.sleep(200);
  }
}
