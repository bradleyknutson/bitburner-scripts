// @ts-nocheck
/** @param {NS} ns */
import {
  servers0Port,
  servers1Port,
  servers2Port,
  servers3Port,
  servers4Port,
  servers5Port,
} from "/startup/servers";

export async function main(ns) {
  const allServers = [
    ...servers0Port,
    ...servers1Port,
    ...servers2Port,
    ...servers3Port,
    ...servers4Port,
    ...servers5Port,
  ];

  for (let server of allServers) {
    ns.getServerMaxMoney(server.host);
    ns.getServerRequiredHackingLevel(server.host);
  }
}
