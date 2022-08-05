// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  // In Progress!
  const hackFile = "/scripts/batchThePlanet/hack.js";
  const growFile = "/scripts/batchThePlanet/grow.js";
  const weakenFile = "/scripts/batchThePlanet/weaken.js";

  const node = "ecorp";
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

  const timeToWeaken = Math.ceil(ns.getWeakenTime(node));
  const timeToGrow = Math.ceil(ns.getGrowTime(node));
  const timeToHack = Math.ceil(ns.getHackTime(node));
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

  const servers = ["home"];

  while (true) {
    // This shouldn't be hit, but... Not efficient enough just yet. Adding this in to go to bed
    // ----------------------------------------------------------------------------------------
    while (ns.getServerMoneyAvailable(node) < ns.getServerMaxMoney(node)) {
      const growing = Math.ceil(ns.getGrowTime(node));
      ns.exec(growFile, "home", 15000, 0, node);
      await ns.sleep(growing + 1000);
    }
    while (
      ns.getServerSecurityLevel(node) > ns.getServerMinSecurityLevel(node)
    ) {
      const weakening = Math.ceil(ns.getWeakenTime(node));
      ns.exec(weakenFile, "home", 15000, 0, node);
      await ns.sleep(weakening + 1000);
    }
    // ----------------------------------------------------------------------------------------

    for (let server of servers) {
      const maxRam = ns.getServerMaxRam(server);
      let usedRam = ns.getServerUsedRam(server);

      while (maxRam - usedRam > totalBatchMemory) {
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
        usedRam = ns.getServerUsedRam(server);
        totalBatches++;
        await ns.sleep(delay * 10);
      }
    }
    await ns.sleep(timeToWeaken + totalDelayTime * totalBatches + 10000);
  }
}
