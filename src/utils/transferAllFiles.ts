import { NS } from "@ns";

export const transferAllFiles = async (ns: NS, name: string): Promise<void> => {
  await ns.scp("/utils/allServers.js", name);
  await ns.scp(ns.ls("home", "/scripts"), name);
};
