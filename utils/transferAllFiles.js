// @ts-nocheck
/** @param {NS} ns */

export const transferAllFiles = async (ns, name) => {
  await ns.scp("/utils/allServers.js", name);
  await ns.scp(ns.ls("home", "/scripts"), name);
};
