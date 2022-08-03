// @ts-nocheck
/** @param {NS} ns */

export async function main(ns) {
  const serverLimit = ns.getPurchasedServerLimit();
  if (ns.getPurchasedServers().length === serverLimit) {
    return;
  }

  ns.print(ns.getPurchasedServerMaxRam());

  const ram = (await ns.prompt("Do you want the max RAM?", { type: "boolean" }))
    ? ns.getPurchasedServerMaxRam()
    : parseInt(
        await ns.prompt("How much RAM on each server?", {
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
          ],
        })
      );
  if (!ram) {
    ns.print("You closed it out, didn't you");
    return;
  }
  const script = "early-hack-template.js";

  for (let i = 0; i < serverLimit; ++i) {
    while (
      ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram)
    ) {
      await ns.sleep(60 * 1000);
    }

    const prefix = "pserv-";
    const hostname = ns.purchaseServer(prefix + i, ram);

    const threads = Math.floor(ram / ns.getScriptRam(script));

    await ns.scp(script, hostname);
    await ns.scp("/utils/allServers.js", hostname);
    ns.exec(script, hostname, threads);
  }
}
