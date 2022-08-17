import { NS } from "@ns";
import { findAllServers } from "/utils/findAllServers";
/** @param {NS} ns */

export async function main(ns: NS): Promise<void> {
  // In Progress!
  const hackFile = "/scripts/batchThePlanet/hack.js";
  const growFile = "/scripts/batchThePlanet/grow.js";
  const weakenFile = "/scripts/batchThePlanet/weaken.js";

  const hackRAM = ns.getScriptRam(hackFile);
  const growRAM = ns.getScriptRam(growFile);
  const weakenRAM = ns.getScriptRam(weakenFile);

  const securityIncreaseByHack = 0.002;
  const securityIncreaseByGrow = 0.004;
  const securityReducedByWeaken = 0.05;

  while (true) {
    const hackingLevel = ns.getHackingLevel();
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
      .filter((server) => server.money > 0)
      .filter((server) => server.level <= hackingLevel)
      .filter((server) => server.ports <= numPortsOpen)
      .filter(
        (server) => server.name !== "catalyst" && server.name !== "joesguns"
      );

    let longestWeakenTime = 0;
    const startingTime = Date.now();
    const startingWeaken = ns.getWeakenTime(allNodes[0].name);

    for (const nodeObj of allNodes) {
      const delay = 100;
      const totalDelayTime = delay * 11;
      let numBatch = 0;

      const nodeStartTime = Date.now();
      if (
        nodeStartTime - startingTime >
        startingWeaken + totalDelayTime * numBatch
      ) {
        continue;
      }
      const node = nodeObj.name;

      const nodeMaxMoney = ns.getServerMaxMoney(node);
      const moneyToSteal = nodeMaxMoney * 0.05;

      // ----------------------------------------------------------------------------------------
      if (node === allNodes[0].name) {
        while (
          ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node) ||
          ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
        ) {
          // const maxGrowThreads = Math.floor(
          //   (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
          //     growRAM /
          //     2
          // );
          // const maxWeakenThreads = Math.floor(
          //   (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
          //     weakenRAM /
          //     2
          // );

          // const growWaitTime = Math.ceil(
          //   ns.getWeakenTime(node) - ns.getGrowTime(node)
          // );
          // ns.exec(weakenFile, "home", maxWeakenThreads, 1000, node);
          // ns.exec(growFile, "home", maxGrowThreads, growWaitTime, node);
          const weakenOneNodeScript = "/utils/weakenOneBatch.js";
          ns.exec(weakenOneNodeScript, "home", 1, node);
          await ns.sleep(Math.ceil(ns.getWeakenTime(node)) + 30 * 1000);
        }
      } else if (
        ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node) ||
        ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
      ) {
        continue;
      }

      // ----------------------------------------------------------------------------------------

      const servers = ["home", ...ns.getPurchasedServers()];

      for (const server of servers) {
        const numThreadsToHack =
          Math.floor(ns.hackAnalyzeThreads(node, moneyToSteal)) || 1;
        if (numThreadsToHack < 0) {
          continue;
        }

        const cores = ns.getServer(server).cpuCores;
        const growth =
          Math.ceil((nodeMaxMoney / (nodeMaxMoney - moneyToSteal)) * 100) / 100;

        const numThreadsToGrow = Math.ceil(
          ns.growthAnalyze(node, growth, cores)
        );

        const numThreadsToWeakenAfterHack = Math.ceil(
          (securityIncreaseByHack * numThreadsToHack) / securityReducedByWeaken
        );

        const numThreadsToWeakenAfterGrow = Math.ceil(
          (securityIncreaseByGrow * numThreadsToGrow) / securityReducedByWeaken
        );

        const timeToWeaken = ns.getWeakenTime(node);
        const timeToGrow = ns.getGrowTime(node);
        const timeToHack = ns.getHackTime(node);

        const hackMemory = hackRAM * numThreadsToHack;
        const weakenMemory = weakenRAM * numThreadsToWeakenAfterHack;
        const weaken2Memory = weakenRAM * numThreadsToWeakenAfterGrow;
        const growMemory = growRAM * numThreadsToGrow;

        const totalBatchMemory =
          hackMemory + weakenMemory + growMemory + weaken2Memory;

        while (
          ns.getServerMaxRam(server) - ns.getServerUsedRam(server) >
            totalBatchMemory &&
          numBatch * totalDelayTime + 10000 < timeToWeaken + totalDelayTime
        ) {
          if (timeToWeaken > longestWeakenTime) {
            longestWeakenTime = timeToWeaken;
          }

          const batchId = Math.floor(Math.random() * 10000000000);

          const hackSleepTime = timeToWeaken - timeToHack;
          ns.exec(
            hackFile,
            server,
            numThreadsToHack || 1,
            hackSleepTime,
            node,
            `batch-${batchId}-hack`
          );

          const weakenSleepTime = delay;
          ns.exec(
            weakenFile,
            server,
            numThreadsToWeakenAfterHack || 1,
            weakenSleepTime,
            node,
            `batch-${batchId}-weaken`
          );

          const growSleepTime = timeToWeaken - timeToGrow + delay * 2;
          ns.exec(
            growFile,
            server,
            numThreadsToGrow || 1,
            growSleepTime,
            node,
            `batch-${batchId}-grow`
          );

          const weakenAfterHackSleepTime = delay * 3;
          ns.exec(
            weakenFile,
            server,
            numThreadsToWeakenAfterGrow || 1,
            weakenAfterHackSleepTime,
            node,
            `batch-${batchId}-weaken2`
          );

          numBatch++;
          await ns.sleep(delay * 5);
        }
      }
    }
    await ns.sleep(longestWeakenTime + 10 * 1000);
  }
}
