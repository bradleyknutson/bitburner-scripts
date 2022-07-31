// @ts-nocheck
/** @param {NS} ns */

import {
  servers0Port,
  servers1Port,
  servers2Port,
  servers3Port,
  servers4Port,
  servers5Port,
  // @ts-ignore
} from "/startup/servers";

export const hackThePlanet = async (ns, hackScript) => {
  const allServers = [
    ...servers0Port,
    ...servers1Port,
    ...servers2Port,
    ...servers3Port,
    ...servers4Port,
    ...servers5Port,
  ];

  for (let server of allServers) {
    if (server.ports >= 1) {
      while (!ns.fileExists("BruteSSH.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.brutessh(server.host);
    }
    if (server.ports >= 2) {
      while (!ns.fileExists("FTPCrack.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.ftpcrack(server.host);
    }
    if (server.ports >= 3) {
      while (!ns.fileExists("relaySMTP.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.relaysmtp(server.host);
    }
    if (server.ports >= 4) {
      while (!ns.fileExists("HTTPworm.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.httpworm(server.host);
    }
    if (server.ports >= 5) {
      while (!ns.fileExists("SQLInject.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.sqlinject(server.host);
    }

    const totalRam = ns.getServerMaxRam(server.host);
    const threads = Math.floor(totalRam / ns.getScriptRam(hackScript));
    ns.print(threads);

    ns.nuke(server.host);
    // ns.installBackdoor();

    if (ns.isRunning(hackScript, server.host)) {
      ns.kill(hackScript, server.host);
    }

    if ((ns.fileExists(hackScript), server.host)) {
      ns.rm(hackScript, server.host);
    }
    await ns.scp(hackScript, server.host);

    ns.exec(hackScript, server.host, threads);
  }
};
