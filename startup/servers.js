module.exports = {
  // Array of all servers that don't need any ports opened
  // to gain root access.
  servers0Port: [
    { host: "foodnstuff", threads: 6, ports: 0 }, // lvl 1
    { host: "sigma-cosmetics", threads: 6, ports: 0 }, // lvl 5
    { host: "joesguns", threads: 6, ports: 0 }, // lvl 10
    { host: "nectar-net", threads: 6, ports: 0 }, // lvl 20
    { host: "hong-fang-tea", threads: 6, ports: 0 }, // lvl 30
    { host: "harakiri-sushi", threads: 6, ports: 0 }, // lvl 40
  ],

  // Array of all servers that only need 1 port opened
  // to gain root access.
  servers1Port: [
    { host: "neo-net", threads: 12, ports: 1 }, // lvl 50
    { host: "zer0", threads: 12, ports: 1 }, // lvl 75
    { host: "max-hardware", threads: 12, ports: 1 }, // lvl 80
    { host: "iron-gym", threads: 12, ports: 1 }, // lvl 100
  ],

  // Array of all servers that need 2 ports opened
  // to gain root access.
  servers2Port: [
    { host: "phantasy", threads: 12, ports: 2 }, // lvl 100,
    { host: "silver-helix", threads: 24, ports: 2 }, // lvl 150
    { host: "omega-net", threads: 12, ports: 2 }, // lvl 201
    { host: "avmnite-02h", threads: 24, ports: 2 }, // lvl 213
    { host: "the-hub", threads: 12, ports: 2 }, // lvl 325
  ],

  // Array of all servers that need 2 ports opened
  // to gain root access.  These have 64 GB of RAM
  servers3Port: [
    { host: "summit-uni", threads: 24, ports: 3 }, // lvl 465
    { host: "I.I.I.I", threads: 96, ports: 3 }, // lvl 356
    { host: "netlink", threads: 48, ports: 3 }, // lvl 384
    { host: "rothman-uni", threads: 48, ports: 3 }, // lvl 412
    { host: "catalyst", threads: 12, ports: 3 }, // lvl 433
  ],
};
