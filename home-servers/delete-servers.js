// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const servers = ns.getPurchasedServers();
  servers.forEach((server) => {
    ns.killall(server);
    ns.deleteServer(server);
  });
}
