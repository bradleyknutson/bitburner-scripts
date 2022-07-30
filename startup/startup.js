/** @param {NS} ns */
const { servers0Port, servers1Port } = require("./servers");

const hackScript = "early-hack-template.js";

const hackThePlanet = async (ns) => {
  const allServers = [...servers0Port, ...servers1Port];

  for (let server of allServers) {
    if (server.ports >= 1) {
      while (!ns.fileExists("BruteSSH.exe")) {
        await ns.sleep(60 * 1000);
      }
      ns.brutessh(server.host);
    }

    ns.nuke(server.host);
    ns.installBackdoor();
    ns.exec(hackScript, server.host, server.threads);
  }
};

export async function main(ns) {
  // Current script running on all servers
  // This is a test
  ns.exec(hackScript, "home", 46);
  ns.exec("purchase-server-32gb.js", "home", 1);

  hackThePlanet(ns);
}
