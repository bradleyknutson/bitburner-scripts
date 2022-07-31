// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const node = "the-hub";
  const moneyThresh = ns.getServerMaxMoney(node) * 0.75;
  const securityThresh = ns.getServerMinSecurityLevel(node) + 5;

  while (true) {
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
