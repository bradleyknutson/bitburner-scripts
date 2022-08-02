// @ts-nocheck
/** @param {NS} ns */

// Array of all servers that don't need any ports opened
// to gain root access.
export const servers0Port = [
  { host: "foodnstuff", ram: 16, ports: 0 }, // lvl 1
  { host: "sigma-cosmetics", ram: 16, ports: 0 }, // lvl 5
  { host: "joesguns", ram: 16, ports: 0 }, // lvl 10
  { host: "nectar-net", ram: 16, ports: 0 }, // lvl 20
  { host: "hong-fang-tea", ram: 16, ports: 0 }, // lvl 30
  { host: "harakiri-sushi", ram: 16, ports: 0 }, // lvl 40
];

// Array of all servers that only need 1 port opened
// to gain root access.
export const servers1Port = [
  { host: "neo-net", ram: 32, ports: 1 }, // lvl 50
  { host: "zer0", ram: 32, ports: 1 }, // lvl 75
  { host: "max-hardware", ram: 32, ports: 1 }, // lvl 80
  { host: "iron-gym", ram: 32, ports: 1 }, // lvl 100
];

// Array of all servers that need 2 ports opened
// to gain root access.
export const servers2Port = [
  { host: "phantasy", ram: 32, ports: 2 }, // lvl 100,
  { host: "silver-helix", ram: 64, ports: 2 }, // lvl 150
  { host: "omega-net", ram: 32, ports: 2 }, // lvl 201
  { host: "avmnite-02h", ram: 32, ports: 2 }, // lvl 213
  { host: "the-hub", ram: 16, ports: 2 }, // lvl 325
];

// Array of all servers that need 3 ports opened
// to gain root access.
export const servers3Port = [
  { host: "summit-uni", ram: 16, ports: 3 }, // lvl 465
  { host: "I.I.I.I", ram: 32, ports: 3 }, // lvl 356
  { host: "netlink", ram: 32, ports: 3 }, // lvl 384
  { host: "rothman-uni", ram: 128, ports: 3 }, // lvl 412
  { host: "catalyst", ram: 128, ports: 3 }, // lvl 433
  { host: "rho-construction", ram: 64, ports: 3 }, // lvl 487
  { host: "millenium-fitness", ram: 256, ports: 3 }, // lvl 487
];

export const servers4Port = [
  { host: "aevum-police", ram: 64, ports: 4 }, // lvl 425
  { host: "alpha-ent", ram: 64, ports: 4 }, // lvl 546
  { host: "lexo-corp", ram: 64, ports: 4 }, // lvl 656
  { host: "global-pharm", ram: 16, ports: 4 }, // lvl 808
  { host: "univ-energy", ram: 64, ports: 4 }, // lvl 810
  { host: "unitalife", ram: 64, ports: 4 }, // lvl 815
];

export const servers5Port = [
  { host: "zb-institute", ram: 128, ports: 5 }, // lvl 732
  { host: "solaris", ram: 64, ports: 5 }, // lvl 847
  { host: "omnia", ram: 64, ports: 5 }, // lvl 896
];
