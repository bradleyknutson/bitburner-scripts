// @ts-nocheck
/** @param {NS} ns */

import { servers as allServers } from "/startup/allServers";

export const hackThePlanet = async (ns, hackScript) => {
  for (let server of allServers) {
    if (server.ports >= 1) {
      while (!ns.fileExists("BruteSSH.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.brutessh(server.name);
    }
    if (server.ports >= 2) {
      while (!ns.fileExists("FTPCrack.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.ftpcrack(server.name);
    }
    if (server.ports >= 3) {
      while (!ns.fileExists("relaySMTP.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.relaysmtp(server.name);
    }
    if (server.ports >= 4) {
      while (!ns.fileExists("HTTPworm.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.httpworm(server.name);
    }
    if (server.ports >= 5) {
      while (!ns.fileExists("SQLInject.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.sqlinject(server.name);
    }

    ns.nuke(server.name);

    const totalRam = ns.getServerMaxRam(server.name);
    ns.print(totalRam);
    if (totalRam === 0) {
      continue;
    }
    ns.print("I made it here somehow");
    const threads = Math.floor(totalRam / ns.getScriptRam(hackScript));

    // ns.installBackdoor();

    if (ns.isRunning(hackScript, server.name)) {
      ns.kill(hackScript, server.name);
    }

    if ((ns.fileExists(hackScript), server.name)) {
      ns.rm(hackScript, server.name);
    }
    await ns.scp(hackScript, server.name);

    ns.exec(hackScript, server.name, threads);
  }
};
