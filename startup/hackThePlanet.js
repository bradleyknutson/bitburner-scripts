// @ts-nocheck
/** @param {NS} ns */

import { servers as allServers } from "/utils/allServers";

export const hackThePlanet = async (ns, hackScript) => {
  ns.disableLog("ALL");
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
    ns.print(`Nuked ${name}`);

    const totalRam = ns.getServerMaxRam(name);

    if (totalRam === 0) {
      ns.print(`Skipping ${name} due to no RAM`);
      continue;
    }

    const threads = Math.floor(totalRam / ns.getScriptRam(hackScript));

    // ns.installBackdoor();

    if (ns.isRunning(hackScript, name) && name !== "home") {
      ns.kill(hackScript, name);
    }

    if (ns.fileExists(hackScript, name) && name !== "home") {
      ns.rm(hackScript, name);
    }
    if (name !== "home") {
      await ns.scp("/utils/allServers.js", name);
      await ns.scp(hackScript, name);
    }

    ns.exec(hackScript, name, threads);
    ns.print(`Script running on ${name}`);
  }
};
