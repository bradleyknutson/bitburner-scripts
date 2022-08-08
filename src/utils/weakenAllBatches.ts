import { NS } from "@ns";
import { findAllServers } from "/utils/findAllServers";

export async function main(ns: NS): Promise<void> {
  const growFile = "/scripts/batchThePlanet/grow.js";
  const weakenFile = "/scripts/batchThePlanet/weaken.js";
  const growRAM = ns.getScriptRam(growFile);
  const weakenRAM = ns.getScriptRam(weakenFile);

  const portFiles = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];
  const numPortsOpen = portFiles.reduce((ports, portFile) => {
    if (ns.fileExists(portFile)) {
      ports += 1;
    }
    return ports;
  }, 0);

  const allServers = await findAllServers(ns);
  const allNodes = await allServers
    .sort((a, b) => b.money - a.money)
    .filter((server) => server.ports <= numPortsOpen);

  const allNodesNeedingWeakenOrGrow = allNodes.filter(
    (server) =>
      ns.getServerSecurityLevel(server.name) >
        ns.getServerMinSecurityLevel(server.name) ||
      ns.getServerMoneyAvailable(server.name) <
        ns.getServerMaxMoney(server.name)
  );

  const serversToWeaken = [...ns.getPurchasedServers().reverse(), "home"];

  for (let i = 0; i < serversToWeaken.length; i++) {
    if (!allNodesNeedingWeakenOrGrow[i]) return;
    const maxGrowThreads = Math.floor(
      (ns.getServerMaxRam(serversToWeaken[i]) -
        ns.getServerUsedRam(serversToWeaken[i])) /
        growRAM /
        2
    );
    const maxWeakenThreads = Math.floor(
      (ns.getServerMaxRam(serversToWeaken[i]) -
        ns.getServerUsedRam(serversToWeaken[i])) /
        weakenRAM /
        2
    );

    const growWaitTime = Math.ceil(
      ns.getWeakenTime(allNodesNeedingWeakenOrGrow[i].name) -
        ns.getGrowTime(allNodesNeedingWeakenOrGrow[i].name)
    );
    ns.exec(
      weakenFile,
      serversToWeaken[i],
      maxWeakenThreads,
      1000,
      allNodesNeedingWeakenOrGrow[i].name
    );
    ns.exec(
      growFile,
      serversToWeaken[i],
      maxGrowThreads,
      growWaitTime,
      allNodesNeedingWeakenOrGrow[i].name
    );
  }
}
