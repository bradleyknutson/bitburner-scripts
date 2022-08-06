import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  if (typeof ns.args[0] === "number" && typeof ns.args[1] === "string") {
    await ns.sleep(ns.args[0]);
    await ns.weaken(ns.args[1]);
  }
}
