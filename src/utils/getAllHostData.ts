import { NS } from "@ns";
import { servers as allServers } from "utils/allServers";

export async function main(ns: NS): Promise<void> {
  for (const server of allServers) {
    ns.getServerMaxMoney(server.name);
    ns.getServerRequiredHackingLevel(server.name);
  }
}
