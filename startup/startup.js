// @ts-nocheck
/** @param {NS} ns */

// @ts-ignore
import { hackThePlanet } from "startup/hackThePlanet";

// Current script running on all servers
const hackScript = "early-hack-template.js";

export async function main(ns) {
  const totalRam = ns.getServerMaxRam("home");
  const usedRam = ns.getServerUsedRam("home");
  const threads = Math.floor(
    (totalRam - usedRam) / ns.getScriptRam(hackScript)
  );
  ns.exec(hackScript, "home", threads);
  ns.exec("home-servers/purchase-server.js", "home", 1);

  await hackThePlanet(ns, hackScript);
}
