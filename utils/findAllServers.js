// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const servers = [];
  const nodesToScan = ["home"];

  for (node of nodesToScan) {
    scan = ns.scan(node);
    for (scannedNode of scan) {
      if (servers) {
      }
    }
  }
}
