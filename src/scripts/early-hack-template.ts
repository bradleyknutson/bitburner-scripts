import { NS } from "@ns";
/** @param {NS} ns */

import { findAllServers } from "/utils/findAllServers";

export async function main(ns: NS): Promise<void> {
  const firstNode = "joesguns";
  const midNode = "catalyst";
  const allServers = await findAllServers(ns);
  const lateNodes = allServers.sort((a, b) => a.money - b.money).slice(-12);

  while (true) {
    let node = "";
    const hackLevel = ns.getHackingLevel();

    const earliestLateNode = lateNodes.sort((a, b) => b.level - a.level)[0];

    if (
      hackLevel > earliestLateNode.level &&
      ns.hasRootAccess(earliestLateNode.name)
    ) {
      node = lateNodes[Math.floor(Math.random() * lateNodes.length)].name;
    } else if (hackLevel > ns.getServerRequiredHackingLevel(midNode)) {
      node = midNode;
    } else {
      node = firstNode;
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
        : await ns.sleep(1 * 1000);
    }
  }
}
