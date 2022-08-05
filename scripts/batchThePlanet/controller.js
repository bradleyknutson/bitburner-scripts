// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  // In Progress!
  const node = "ecorp";

  const hackFile = "/scripts/batchThePlanet/hack.js";
  const growFile = "/scripts/batchThePlanet/grow.js";
  const weakenFile = "/scripts/batchThePlanet/weaken.js";

  // ----------------------------------------------------------------------------------------
  while (ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node)) {
    let maxGrowThreads =
      (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
      ns.getScriptRam(growFile);
    ns.exec(growFile, "home", maxGrowThreads, 0, node);
    await ns.sleep(Math.ceil(ns.getGrowTime(node)) + 1000);
  }
  while (ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)) {
    let maxWeakenThreads =
      (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
      ns.getScriptRam(weakenFile);
    ns.exec(weakenFile, "home", maxWeakenThreads, 0, node);
    await ns.sleep(Math.ceil(ns.getWeakenTime(node)) + 1000);
  }
  // ----------------------------------------------------------------------------------------

  const nodeMaxMoney = ns.getServerMaxMoney(node);
  const moneyToSteal = nodeMaxMoney * 0.5;

  const numThreadsToHack = Math.floor(
    ns.hackAnalyzeThreads(node, moneyToSteal)
  );

  const hackAnalyzeSecurity = ns.hackAnalyzeSecurity(numThreadsToHack, node);
  const securityReducedByWeaken = 0.05;
  const securityIncreaseByGrow = 0.004;

  const numThreadsToGrow = Math.ceil(
    ns.growthAnalyze(node, nodeMaxMoney / (nodeMaxMoney - moneyToSteal))
  );

  const numThreadsToWeakenAfterHack = Math.ceil(
    hackAnalyzeSecurity / securityReducedByWeaken
  );

  const numThreadsToWeakenAfterGrow = Math.ceil(
    (securityIncreaseByGrow * numThreadsToGrow) / securityReducedByWeaken
  );

  const timeToWeaken = ns.getWeakenTime(node);
  const timeToGrow = ns.getGrowTime(node);
  const timeToHack = ns.getHackTime(node);
  const delay = 250;

  const totalDelayTime = delay * 16;

  const hackMemory = ns.getScriptRam(hackFile) * numThreadsToHack;
  const weakenMemory =
    ns.getScriptRam(weakenFile) * numThreadsToWeakenAfterHack;
  const weaken2Memory =
    ns.getScriptRam(weakenFile) * numThreadsToWeakenAfterGrow;
  const growMemory = ns.getScriptRam(growFile) * numThreadsToGrow;
  const totalBatchMemory =
    hackMemory + weakenMemory + growMemory + weaken2Memory;

  const servers = ["home", ...ns.getPurchasedServers()];

  while (true) {
    // This shouldn't be hit, but... Not efficient enough just yet. Adding this in to go to bed
    // ----------------------------------------------------------------------------------------
    while (ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node)) {
      await ns.sleep(timeToWeaken + 1000);
      let maxGrowThreads =
        (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
        ns.getScriptRam(growFile);
      ns.exec(growFile, "home", maxGrowThreads, 0, node);
      await ns.sleep(Math.ceil(ns.getGrowTime(node)) + 1000);
    }
    while (
      ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
    ) {
      await ns.sleep(timeToWeaken + 1000);
      let maxWeakenThreads =
        (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) /
        ns.getScriptRam(weakenFile);
      ns.exec(weakenFile, "home", maxWeakenThreads, 0, node);
      await ns.sleep(Math.ceil(ns.getWeakenTime(node)) + 1000);
    }
    // ----------------------------------------------------------------------------------------
    let numBatch = 0;
    for (let server of servers) {
      while (
        ns.getServerMaxRam(server) - ns.getServerUsedRam(server) >
          totalBatchMemory &&
        batch * totalDelayTime < timeToWeaken + totalDelayTime + 10000
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
        await ns.sleep(delay * 10);
      }
    }
    await ns.sleep(timeToWeaken + totalDelayTime + 10000);
  }
}
