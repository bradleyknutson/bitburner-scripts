import { NS } from "@ns";
/** @param {NS} ns */

import { hackThePlanet } from "startup/hackThePlanet";

// Current script running on all servers
const hackScript = "/scripts/early-hack-template.js";

export async function main(ns: NS): Promise<void> {
  ns.exec("utils/writeServersToFile.js", "home", 1);
  ns.exec("home-servers/purchase-server.js", "home", 1);

  if (ns.isRunning(hackScript, "home")) {
    ns.kill(hackScript, "home");
  }

  const totalRam = ns.getServerMaxRam("home");
  const usedRam = ns.getServerUsedRam("home") + 6;
  const threads = Math.floor(
    (totalRam - usedRam) / ns.getScriptRam(hackScript)
  );

  if (threads >= 1) {
    ns.exec(hackScript, "home", threads);
  } else {
    ns.alert("Not enough RAM to run hackscript");
  }

  await hackThePlanet(ns, hackScript);
}
