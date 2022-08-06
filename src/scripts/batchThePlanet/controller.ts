import { NS } from "@ns";

import { servers as allServers } from "utils/allServers.js";

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
    const node = allServers
      .sort((a, b) => b.money - a.money)
      .filter((server) => server.level < hackingLevel)[0].name;

    ns.alert(`Hacking node ${node}`);

    // ----------------------------------------------------------------------------------------
    while (
      ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node) ||
      ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
    ) {
      const maxGrowThreads = Math.floor(
        (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / growRAM / 2
      );
      const maxWeakenThreads = Math.floor(
        (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
          weakenRAM /
          2
      );

      const growWaitTime = Math.ceil(
        ns.getWeakenTime(node) - ns.getGrowTime(node)
      );
      ns.exec(weakenFile, "home", maxWeakenThreads, 1000, node);
      ns.exec(growFile, "home", maxGrowThreads, growWaitTime, node);

      await ns.sleep(Math.ceil(ns.getWeakenTime(node)) + 5000);
    }

    // ----------------------------------------------------------------------------------------

    const nodeMaxMoney = ns.getServerMaxMoney(node);
    const moneyToSteal = nodeMaxMoney * 0.5;

    const numThreadsToHack = Math.floor(
      ns.hackAnalyzeThreads(node, moneyToSteal)
    );

    const numThreadsToGrow = Math.ceil(
      ns.growthAnalyze(
        node,
        Math.ceil((nodeMaxMoney / (nodeMaxMoney - moneyToSteal)) * 100) / 100
      )
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
    const delay = 150;

    const totalDelayTime = delay * 8;

    const hackMemory = hackRAM * numThreadsToHack;
    const weakenMemory = weakenRAM * numThreadsToWeakenAfterHack;
    const weaken2Memory = weakenRAM * numThreadsToWeakenAfterGrow;
    const growMemory = growRAM * numThreadsToGrow;

    const totalBatchMemory =
      hackMemory + weakenMemory + growMemory + weaken2Memory;

    const servers = [
      "home",
      ...ns.getPurchasedServers(),
      ...allServers.sort((a, b) => a.ram - b.ram).map((server) => server.name),
    ];

    // This shouldn't be hit, but... Not efficient enough just yet. Adding this in to go to bed
    // ----------------------------------------------------------------------------------------
    // while (ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node)) {
    //   ns.alert("You fucked up with the money");
    //   await ns.sleep(timeToWeaken + 1000);
    //   const maxGrowThreads =
    //     (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / growRAM;
    //   ns.exec(growFile, "home", maxGrowThreads, 0, node);
    //   await ns.sleep(Math.ceil(ns.getGrowTime(node)) + 1000);
    // }
    // while (
    //   ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
    // ) {
    //   ns.alert("You fucked up with the security");
    //   await ns.sleep(timeToWeaken + 1000);
    //   const maxWeakenThreads =
    //     (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / weakenRAM;
    //   ns.exec(weakenFile, "home", maxWeakenThreads, 0, node);
    //   await ns.sleep(Math.ceil(ns.getWeakenTime(node)) + 1000);
    // }
    // ----------------------------------------------------------------------------------------
    let numBatch = 0;
    for (const server of servers) {
      while (
        ns.getServerMaxRam(server) - ns.getServerUsedRam(server) >
          totalBatchMemory &&
        numBatch * totalDelayTime < timeToWeaken + totalDelayTime + 10000
      ) {
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
    await ns.sleep(timeToWeaken + totalDelayTime * numBatch + 20000);
  }
}