// @ts-nocheck
/** @param {NS} ns */

import { servers as allServers } from "/utils/allServers";

export async function main(ns) {
  const firstNode = "joesguns";
  const midNode = "catalyst";
  const lateNodes = allServers.sort((a, b) => a.money - b.money).slice(-12);

  while (true) {
    let node = "";
    const hackLevel = ns.getHackingLevel();

    if (hackLevel > 900 && ns.hasRootAccess("omnia")) {
      node = lateNodes[Math.floor(Math.random() * lateNodes.length)];
    } else if (hackLevel > 433 && ns.hasRootAccess(midNode)) {
      node = midNode;
    } else {
      node = firstNode;
    }

    if (hackLevel < ns.getServerRequiredHackingLevel(node)) {
      ns.print(`Too low level for ${node}`);
      continue;
    }

    const moneyThresh = ns.getServerMaxMoney(node) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(node) + 5;

    if (ns.getServerSecurityLevel(node) > securityThresh) {
      await ns.weaken(node);
    } else if (ns.getServerMoneyAvailable(node) < moneyThresh) {
      await ns.grow(node);
    } else {
      ns.getServerRequiredHackingLevel(node) < ns.getHackingLevel()
        ? await ns.hack(node)
        : await ns.sleep(10 * 1000);
    }
  }
}
