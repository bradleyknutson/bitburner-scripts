import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  interface Server {
    name: string;
    ports: number;
    ram: number;
    money: number;
    level: number;
  }

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

  const serversString = serverMap
    .map((server) => {
      return `\n\t{name: "${server.name}", ports: ${server.ports}, ram: ${server.ram}, money: ${server.money}, level: ${server.level}}`;
    })
    .join(",");

  const date = new Date(Date.now()).toISOString();

  await ns.write(
    "/utils/allServers.js",
    `\nimport { NS } from "@ns";\n\n// Created ${date}\n\nexport const servers = [${serversString}\n];`,
    "w"
  );
}
