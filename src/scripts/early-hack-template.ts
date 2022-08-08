import { NS } from "@ns";
/** @param {NS} ns */

export async function main(ns: NS): Promise<void> {
  const firstNode = "joesguns";
  const midNode = "catalyst";

  while (true) {
    let node = "";
    const hackLevel = ns.getHackingLevel();

    if (
      hackLevel > ns.getServerRequiredHackingLevel(midNode) &&
      ns.hasRootAccess(midNode)
    ) {
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
