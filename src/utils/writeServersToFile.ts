import { NS } from "@ns";
import { findAllServers } from "/utils/findAllServers";

export async function main(ns: NS): Promise<void> {
  const allServers = await findAllServers(ns);

  const serversString = allServers
    .map((server) => {
      return `\n\t{name: "${server.name}", ports: ${server.ports}, ram: ${server.ram}, money: ${server.money}, level: ${server.level}}`;
    })
    .join(",");

  const date = new Date(Date.now()).toISOString();

  await ns.write(
    "/utils/allServers.js",
    `\nimport { NS } from "@ns";
/** @param {NS} ns */\n\n// Created ${date}\n\nexport const servers = [${serversString}\n];`,
    "w"
  );
}
