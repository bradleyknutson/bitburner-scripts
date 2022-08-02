// @ts-nocheck
/** @param {NS} ns */

import { servers as allServers } from "/utils/allServers";

export const hackThePlanet = async (ns, hackScript) => {
  for (let server of allServers) {
    const { ports, name } = server;
    if (ports >= 1) {
      while (!ns.fileExists("BruteSSH.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.brutessh(name);
    }
    if (ports >= 2) {
      while (!ns.fileExists("FTPCrack.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.ftpcrack(name);
    }
    if (ports >= 3) {
      while (!ns.fileExists("relaySMTP.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.relaysmtp(name);
    }
    if (ports >= 4) {
      while (!ns.fileExists("HTTPworm.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.httpworm(name);
    }
    if (ports >= 5) {
      while (!ns.fileExists("SQLInject.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.sqlinject(name);
    }

    ns.nuke(name);

    const totalRam = ns.getServerMaxRam(name);

    if (totalRam === 0) {
      ns.print(`Skipping ${name}`);
      continue;
    }

    const threads = Math.floor(totalRam / ns.getScriptRam(hackScript));

    // ns.installBackdoor();

    if (ns.isRunning(hackScript, name)) {
      ns.kill(hackScript, name);
    }

    if ((ns.fileExists(hackScript), name)) {
      ns.rm(hackScript, name);
    }
    await ns.scp(hackScript, name);

    ns.exec(hackScript, name, threads);
  }
};
