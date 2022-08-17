import { NS } from "@ns";
/** @param {NS} ns */

import { findAllServers } from "/utils/findAllServers";

export async function main(ns: NS): Promise<void> {
  // A single batch consists of four actions:

  // A hack script removes a predefined, precalculated amount of money from the target server.
  // A weaken script counters the security increase of the hack script.
  // A grow script counters the money decrease caused by the hack script.
  // A weaken script counters the security increase caused by the grow script.

  // These "batches" are timed so that the second batch "kicks off" right when the first stops.
  // Example:
  //   Weaken takes 10 minutes
  //   Grow takes 5
  //   Hack takes 2
  //   Weaken starts, soon after weaken starts again, a little after 5 minutes Grow starts, and a little after 8 total minutes Hack starts.
  //
  //   Hack should finish first, then right afterward the first weaken finishes, right afterward grow finishes to increase the money again,
  //   and the second weaken then finishes to counter the security increase from the grow.

  //   A second batch should also finish right after the first one and so on, so it is continually being hacked, weakened, grown, and weakened again.

  // A calculation to determine the optimal number of threads for each action based on the individual server is needed.  Once this is done
  // calculations for each server can be made so that, based on the number of threads my entire game has available, I can optimally continually drain and grow all
  // of the money from as many servers as possible.

  // To start I can write how a single batch will work for purpose, including how many threads are needed to perform the best action which should be able to be done
  // from my home server.  After that, I can get it to repeat the batch start process continually.  With this I can calculate how many threads are needed for any given
  // server to have continually running batches.  Then I can begin pooling all of the threads I have available to do this on as many servers as possible.

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
  // const allServers = await findAllServers(ns);
  // const node = allServers
  //   .sort((a, b) => b.money - a.money)
  //   .filter((server) => server.level <= hackingLevel)
  //   .filter((server) => server.ports <= numPortsOpen)[0].name;
  const node = "harakiri-sushi";
  const server = "home";

  const nodeMaxMoney = ns.getServerMaxMoney(node);
  const nodeMoneyAvailable = ns.getServerMoneyAvailable(node);
  const moneyToSteal = nodeMaxMoney * 0.05;

  const minSecurity = ns.getServerMinSecurityLevel(node);
  const securityLevel = ns.getServerSecurityLevel(node);

  const numThreadsToHack = Math.floor(
    ns.hackAnalyzeThreads(node, moneyToSteal)
  );

  const hackAnalyzeSecurity = ns.hackAnalyzeSecurity(numThreadsToHack, node);
  const weakenAnalyze = ns.weakenAnalyze(1);
  const securityIncreaseByGrow = 0.004;

  const cores = ns.getServer(server).cpuCores;
  const numThreadsToGrow = Math.ceil(
    ns.growthAnalyze(
      node,
      Math.ceil((nodeMaxMoney / (nodeMaxMoney - moneyToSteal)) * 100) / 100,
      cores
    )
  );

  const numThreadsToWeakenAfterHack = Math.ceil(
    hackAnalyzeSecurity / weakenAnalyze
  );
  const growthAnalyzeSecurity = ns.growthAnalyzeSecurity(
    numThreadsToGrow,
    node,
    ns.getServer(server).cpuCores
  );

  const numThreadsToWeakenAfterGrow = Math.ceil(
    (securityIncreaseByGrow * numThreadsToGrow) / weakenAnalyze
  );

  // const player = ns.getPlayer();
  const timeToWeakenExample = Math.ceil(ns.getWeakenTime(node));
  const timeToGrowExample = Math.ceil(ns.getGrowTime(node));
  const timeToHackExample = Math.ceil(ns.getHackTime(node));

  ns.alert(`Min Security : ${minSecurity}, Current: ${securityLevel}`);
  ns.alert(`Max Money: ${nodeMaxMoney}, Current Money: ${nodeMoneyAvailable}`);

  ns.alert(
    `Money to steal: ${moneyToSteal}\nthreads to hack money: ${numThreadsToHack}\nThreads to Weaken after hacking: ${numThreadsToWeakenAfterHack}\nThreads to Grow: ${numThreadsToGrow}\nThreads to Weaken After Grow: ${numThreadsToWeakenAfterGrow}`
  );

  ns.alert(
    `Time to weaken: ${timeToWeakenExample}\nTime to Grow: ${timeToGrowExample}\nTime to Hack: ${timeToHackExample}`
  );

  ns.alert(`
		growthAnalyzeSecurity: ${growthAnalyzeSecurity}
		weakenAnalyze: ${weakenAnalyze}
		numThreadsToWeakenAfterGrow: ${numThreadsToWeakenAfterGrow}
	`);

  // --------------------------------------------------------------------------------------------
  // await ns.grow(node);

  // const moneyAfterGrow = ns.getServerMoneyAvailable(node);
  // const securityAfterGrow = ns.getServerSecurityLevel(node);

  // ns.alert(`
  // 	Money Before: ${nodeMoneyAvailable}
  // 	Money After: ${moneyAfterGrow}
  // 	Max Money: ${nodeMaxMoney}

  // 	Security After Grow: ${securityAfterGrow}
  // 	Threads to weaken? ${numThreadsToWeakenAfterGrow}
  // `)
  // --------------------------------------------------------------------------------------------

  //   const delay = 100;
  //   const batchId = Math.random() * 100000000;
  //   const timeToWeaken = ns.getWeakenTime(node);
  //   const timeToGrow = ns.getGrowTime(node);
  //   const timeToHack = ns.getHackTime(node);

  //   const hackSleepTime = timeToWeaken - timeToHack;
  //   ns.exec(
  //     "/scripts/hackThePlanetBetter/hack.js",
  //     server,
  //     numThreadsToHack || 1,
  //     hackSleepTime,
  //     node,
  //     `batch-${batchId}-hack`
  //   );

  //   const weakenSleepTime = delay;
  //   ns.exec(
  //     "/scripts/hackThePlanetBetter/weaken.js",
  //     server,
  //     numThreadsToWeakenAfterHack || 1,
  //     weakenSleepTime,
  //     node,
  //     `batch-${batchId}-weaken`
  //   );

  //   const growSleepTime = timeToWeaken - timeToGrow + delay * 2;
  //   ns.exec(
  //     "/scripts/hackThePlanetBetter/grow.js",
  //     server,
  //     numThreadsToGrow || 1,
  //     growSleepTime,
  //     node,
  //     `batch-${batchId}-grow`
  //   );

  //   const weakenAfterHackSleepTime = delay * 3;
  //   ns.exec(
  //     "/scripts/hackThePlanetBetter/weaken.js",
  //     server,
  //     numThreadsToWeakenAfterGrow || 1,
  //     weakenAfterHackSleepTime,
  //     node,
  //     `batch-${batchId}-weaken2`
  //   );

  //   await ns.sleep(delay);
}
