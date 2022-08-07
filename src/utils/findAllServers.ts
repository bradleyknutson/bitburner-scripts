import { NS } from "@ns";
/** @param {NS} ns */

export interface Server {
  name: string;
  ports: number;
  ram: number;
  money: number;
  level: number;
}

export async function findAllServers(ns: NS): Promise<Server[]> {
  const servers: string[] = [];
  const scannedNodes: string[] = [];
  const nodesToScan = ["home"];

  while (nodesToScan.length !== 0) {
    nodesToScan.forEach((node) => {
      const scan = ns.scan(node);
      scan.forEach((foundNode) => {
        if (
          !scannedNodes.includes(foundNode) &&
          !nodesToScan.includes(foundNode) &&
          !foundNode.includes("pserv")
        ) {
          nodesToScan.push(foundNode);
        }
        if (!servers.includes(foundNode) && !foundNode.includes("pserv")) {
          servers.push(foundNode);
        }
      });
      scannedNodes.push(node);
      nodesToScan.splice(nodesToScan.indexOf(node), 1);
    });
  }

  const serverMap: Server[] = servers
    .map((server) => {
      return {
        name: server,
        ports: ns.getServerNumPortsRequired(server),
        ram: ns.getServerMaxRam(server),
        money: ns.getServerMaxMoney(server),
        level: ns.getServerRequiredHackingLevel(server),
      };
    })
    .sort((a, b) => a.ports - b.ports || a.level - b.level);

  return serverMap;
}
