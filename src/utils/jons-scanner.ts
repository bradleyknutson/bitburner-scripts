import { NS } from "@ns";
export async function main(ns: NS): Promise<void> {
  const servers = ns.scan();
  const modifiedServers = servers.filter((node) => {
    return (
      !node.includes("pserv") &&
      !node.includes("darkweb") &&
      !node.includes("home")
    );
  });

  for (let i = 0; i < 201; i++) {
    modifiedServers.forEach((node) => {
      const scan = ns.scan(node);
      scan.forEach((server) => {
        if (!modifiedServers.includes(server)) {
          modifiedServers.push(server);
        }
      });
    });
  }
  const serverList = modifiedServers.filter((node) => {
    return (
      !node.includes("pserv") &&
      !node.includes("darkweb") &&
      !node.includes("home")
    );
  });

  const serverMap = serverList.map((node) => {
    const ports = ns.getServerNumPortsRequired(node);
    const level = ns.getServerRequiredHackingLevel(node);
    const ram = ns.getServerMaxRam(node);
    const money = ns.getServerMaxMoney(node);

    return { name: node, ports: ports, level: level, ram: ram, money: money };
  });
  ns.print(serverMap);
}
