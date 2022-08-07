import { NS } from "@ns";
/** @param {NS} ns */

import { transferAllFiles } from "utils/transferAllFiles";

export async function main(ns: NS): Promise<void> {
  const serverLimit = ns.getPurchasedServerLimit();
  if (ns.getPurchasedServers().length === serverLimit) {
    ns.alert("Already purchased all servers");
    return;
  }

  ns.print(ns.getPurchasedServerMaxRam());

  let ram = 0;
  const maxRam = await ns.prompt("Do you want the max RAM?", {
    type: "boolean",
  });
  if (maxRam) {
    ram = ns.getPurchasedServerMaxRam();
  } else {
    const ramChoice =
      (await ns.prompt("How much RAM on each server?", {
        type: "select",
        choices: [
          "32",
          "64",
          "128",
          "256",
          "512",
          "1024",
          "2048",
          "4096",
          "8192",
          "16384",
          "32768",
          "65536",
          "131072",
          "262144",
          "524288",
          "1048576",
        ],
      })) || "0";
    if (typeof ramChoice === "string") {
      ram = parseInt(ramChoice);
    }
  }

  if (!ram) {
    ns.print("You closed it out, didn't you");
    return;
  }

  for (let i = 0; i < serverLimit; ++i) {
    while (
      ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram)
    ) {
      await ns.sleep(60 * 1000);
    }

    const prefix = "pserv-";
    const hostname = ns.purchaseServer(prefix + i, ram);

    await transferAllFiles(ns, hostname);
  }
}
