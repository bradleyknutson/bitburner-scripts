import { NS } from "@ns";
/** @param {NS} ns */
import { findAllServers } from "/utils/findAllServers";

export async function main(ns: NS): Promise<void> {
  const allServers = await findAllServers(ns);
  for (const server of allServers) {
    ns.getServerMaxMoney(server.name);
    ns.getServerRequiredHackingLevel(server.name);
  }
}
