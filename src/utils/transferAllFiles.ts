import { NS } from "@ns";
/** @param {NS} ns */

export const transferAllFiles = async (ns: NS, name: string): Promise<void> => {
  await ns.scp(ns.ls("home", "/utils"), name);
  await ns.scp(ns.ls("home", "/scripts"), name);
};
