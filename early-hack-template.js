// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const firstNode = "joesguns";
  const midNode = "catalyst";
  const lateNodes = [
    "global-pharm",
    "univ-energy",
    "unitalife",
    "zb-institute",
    "solaris",
    "omnia",
  ];

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
