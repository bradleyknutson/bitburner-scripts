// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const maxNumNodes = 24;
  const moneyOverhead = 0.1;

  const currentNodes = [];
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    currentNodes.push({});
  }

  while (true) {
    if (
      ns.hacknet.numNodes() < maxNumNodes &&
      ns.hacknet.getPurchaseNodeCost() < ns.getPlayer().money * moneyOverhead
    ) {
      ns.hacknet.purchaseNode();
    } else {
      return;
    }
  }
}
// In Progress
