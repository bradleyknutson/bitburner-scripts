// @ts-nocheck
/** @param {NS} ns */
import { servers as allServers } from "/utils/allServers";

export async function main(ns) {
  for (let server of allServers) {
    ns.getServerMaxMoney(server.host);
    ns.getServerRequiredHackingLevel(server.host);
  }
}
