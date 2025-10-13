export interface NetworkConfig {
  name: string;
  id: number;
  url: string;
  tier: string;
  supportsTraces?: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  abstract: {
    name: "Abstract",
    id: 2741,
    url: "https://abstract.hypersync.xyz",
    tier: "🪨"
  },
  arbitrum: {
    name: "Arbitrum",
    id: 42161,
    url: "https://arbitrum.hypersync.xyz",
    tier: "🥈"
  },
  "arbitrum-nova": {
    name: "Arbitrum Nova",
    id: 42170,
    url: "https://arbitrum-nova.hypersync.xyz",
    tier: "🥉"
  },
  "arbitrum-sepolia": {
    name: "Arbitrum Sepolia",
    id: 421614,
    url: "https://arbitrum-sepolia.hypersync.xyz",
    tier: "🎒"
  },
  aurora: {
    name: "Aurora",
    id: 1313161554,
    url: "https://aurora.hypersync.xyz",
    tier: "🪨"
  },
  "aurora-turbo": {
    name: "Aurora Turbo",
    id: 1313161567,
    url: "https://aurora-turbo.hypersync.xyz",
    tier: "🪨"
  },
  avalanche: {
    name: "Avalanche",
    id: 43114,
    url: "https://avalanche.hypersync.xyz",
    tier: "🥉"
  },
  base: {
    name: "Base",
    id: 8453,
    url: "https://base.hypersync.xyz",
    tier: "🏅"
  },
  "base-sepolia": {
    name: "Base Sepolia",
    id: 84532,
    url: "https://base-sepolia.hypersync.xyz",
    tier: "🎒"
  },
  berachain: {
    name: "Berachain",
    id: 80094,
    url: "https://berachain.hypersync.xyz",
    tier: "🥉"
  },
  "berachain-bartio": {
    name: "Berachain Bartio",
    id: 80084,
    url: "https://berachain-bartio.hypersync.xyz",
    tier: "🎒"
  },
  blast: {
    name: "Blast",
    id: 81457,
    url: "https://blast.hypersync.xyz",
    tier: "🥉"
  },
  "blast-sepolia": {
    name: "Blast Sepolia",
    id: 168587773,
    url: "https://blast-sepolia.hypersync.xyz",
    tier: "🎒"
  },
  boba: {
    name: "Boba",
    id: 288,
    url: "https://boba.hypersync.xyz",
    tier: "🪨"
  },
  bsc: {
    name: "BSC",
    id: 56,
    url: "https://bsc.hypersync.xyz",
    tier: "🥉"
  },
  "bsc-testnet": {
    name: "BSC Testnet",
    id: 97,
    url: "https://bsc-testnet.hypersync.xyz",
    tier: "🎒"
  },
  celo: {
    name: "Celo",
    id: 42220,
    url: "https://celo.hypersync.xyz",
    tier: "🪨"
  },
  "chainweb-testnet-20": {
    name: "Chainweb Testnet 20",
    id: 5920,
    url: "https://chainweb-testnet-20.hypersync.xyz",
    tier: "🪨"
  },
  "chainweb-testnet-21": {
    name: "Chainweb Testnet 21",
    id: 5921,
    url: "https://chainweb-testnet-21.hypersync.xyz",
    tier: "🪨"
  },
  "chainweb-testnet-22": {
    name: "Chainweb Testnet 22",
    id: 5922,
    url: "https://chainweb-testnet-22.hypersync.xyz",
    tier: "🪨"
  },
  "chainweb-testnet-23": {
    name: "Chainweb Testnet 23",
    id: 5923,
    url: "https://chainweb-testnet-23.hypersync.xyz",
    tier: "🪨"
  },
  "chainweb-testnet-24": {
    name: "Chainweb Testnet 24",
    id: 5924,
    url: "https://chainweb-testnet-24.hypersync.xyz",
    tier: "🪨"
  },
  chiliz: {
    name: "Chiliz",
    id: 88888,
    url: "https://chiliz.hypersync.xyz",
    tier: "🪨"
  },
  "citrea-testnet": {
    name: "Citrea Testnet",
    id: 5115,
    url: "https://citrea-testnet.hypersync.xyz",
    tier: "🪨"
  },
  curtis: {
    name: "Curtis",
    id: 33111,
    url: "https://curtis.hypersync.xyz",
    tier: "🪨"
  },
  cyber: {
    name: "Cyber",
    id: 7560,
    url: "https://cyber.hypersync.xyz",
    tier: "🪨"
  },
  damon: {
    name: "Damon",
    id: 341,
    url: "https://damon.hypersync.xyz",
    tier: "🪨"
  },
  "eth-traces": {
    name: "Eth Traces",
    id: 1,
    url: "https://eth-traces.hypersync.xyz",
    tier: "🏅",
    supportsTraces: true
  },
  ethereum: {
    name: "Ethereum Mainnet",
    id: 1,
    url: "https://eth.hypersync.xyz",
    tier: "🏅"
  },
  fantom: {
    name: "Fantom",
    id: 250,
    url: "https://fantom.hypersync.xyz",
    tier: "🪨"
  },
  flare: {
    name: "Flare",
    id: 14,
    url: "https://flare.hypersync.xyz",
    tier: "🪨"
  },
  fraxtal: {
    name: "Fraxtal",
    id: 252,
    url: "https://fraxtal.hypersync.xyz",
    tier: "🪨"
  },
  fuji: {
    name: "Fuji",
    id: 43113,
    url: "https://fuji.hypersync.xyz",
    tier: "🎒"
  },
  "galadriel-devnet": {
    name: "Galadriel Devnet",
    id: 696969,
    url: "https://galadriel-devnet.hypersync.xyz",
    tier: "🎒"
  },
  gnosis: {
    name: "Gnosis",
    id: 100,
    url: "https://gnosis.hypersync.xyz",
    tier: "🏅"
  },
  "gnosis-chiado": {
    name: "Gnosis Chiado",
    id: 10200,
    url: "https://gnosis-chiado.hypersync.xyz",
    tier: "🎒"
  },
  "gnosis-traces": {
    name: "Gnosis Traces",
    id: 100,
    url: "https://gnosis-traces.hypersync.xyz",
    tier: "🥉",
    supportsTraces: true
  },
  "harmony-shard-0": {
    name: "Harmony Shard 0",
    id: 1666600000,
    url: "https://harmony-shard-0.hypersync.xyz",
    tier: "🪨"
  },
  holesky: {
    name: "Holesky",
    id: 17000,
    url: "https://holesky.hypersync.xyz",
    tier: "🎒"
  },
  hyperliquid: {
    name: "Hyperliquid",
    id: 999,
    url: "https://hyperliquid.hypersync.xyz",
    tier: "🪨"
  },
  ink: {
    name: "Ink",
    id: 57073,
    url: "https://ink.hypersync.xyz",
    tier: "🪨"
  },
  kroma: {
    name: "Kroma",
    id: 255,
    url: "https://kroma.hypersync.xyz",
    tier: "🪨"
  },
  linea: {
    name: "Linea",
    id: 59144,
    url: "https://linea.hypersync.xyz",
    tier: "🥉"
  },
  lisk: {
    name: "Lisk",
    id: 1135,
    url: "https://lisk.hypersync.xyz",
    tier: "🪨"
  },
  lukso: {
    name: "Lukso",
    id: 42,
    url: "https://lukso.hypersync.xyz",
    tier: "🪨"
  },
  "lukso-testnet": {
    name: "Lukso Testnet",
    id: 4201,
    url: "https://lukso-testnet.hypersync.xyz",
    tier: "🎒"
  },
  manta: {
    name: "Manta",
    id: 169,
    url: "https://manta.hypersync.xyz",
    tier: "🪨"
  },
  mantle: {
    name: "Mantle",
    id: 5000,
    url: "https://mantle.hypersync.xyz",
    tier: "🪨"
  },
  "megaeth-testnet": {
    name: "Megaeth Testnet",
    id: 6342,
    url: "https://megaeth-testnet.hypersync.xyz",
    tier: "🥈"
  },
  merlin: {
    name: "Merlin",
    id: 4200,
    url: "https://merlin.hypersync.xyz",
    tier: "🪨"
  },
  metall2: {
    name: "Metall2",
    id: 1750,
    url: "https://metall2.hypersync.xyz",
    tier: "🪨"
  },
  "mev-commit": {
    name: "Mev Commit",
    id: 17864,
    url: "https://mev-commit.hypersync.xyz",
    tier: "🪨"
  },
  mode: {
    name: "Mode",
    id: 34443,
    url: "https://mode.hypersync.xyz",
    tier: "🪨"
  },
  "monad-testnet": {
    name: "Monad Testnet",
    id: 10143,
    url: "https://monad-testnet.hypersync.xyz",
    tier: "🏅"
  },
  "moonbase-alpha": {
    name: "Moonbase Alpha",
    id: 1287,
    url: "https://moonbase-alpha.hypersync.xyz",
    tier: "🪨"
  },
  moonbeam: {
    name: "Moonbeam",
    id: 1284,
    url: "https://moonbeam.hypersync.xyz",
    tier: "🪨"
  },
  morph: {
    name: "Morph",
    id: 2818,
    url: "https://morph.hypersync.xyz",
    tier: "🪨"
  },
  opbnb: {
    name: "OpBNB",
    id: 204,
    url: "https://opbnb.hypersync.xyz",
    tier: "🪨"
  },
  optimism: {
    name: "Optimism",
    id: 10,
    url: "https://optimism.hypersync.xyz",
    tier: "🏅"
  },
  "optimism-sepolia": {
    name: "Optimism Sepolia",
    id: 11155420,
    url: "https://optimism-sepolia.hypersync.xyz",
    tier: "🎒"
  },
  plume: {
    name: "Plume",
    id: 98866,
    url: "https://plume.hypersync.xyz",
    tier: "🪨"
  },
  polygon: {
    name: "Polygon",
    id: 137,
    url: "https://polygon.hypersync.xyz",
    tier: "🥈"
  },
  "polygon-amoy": {
    name: "Polygon Amoy",
    id: 80002,
    url: "https://polygon-amoy.hypersync.xyz",
    tier: "🥉"
  },
  "polygon-zkevm": {
    name: "Polygon zkEVM",
    id: 1101,
    url: "https://polygon-zkevm.hypersync.xyz",
    tier: "🪨"
  },
  rootstock: {
    name: "Rootstock",
    id: 30,
    url: "https://rootstock.hypersync.xyz",
    tier: "🪨"
  },
  saakuru: {
    name: "Saakuru",
    id: 7225878,
    url: "https://saakuru.hypersync.xyz",
    tier: "🪨"
  },
  scroll: {
    name: "Scroll",
    id: 534352,
    url: "https://scroll.hypersync.xyz",
    tier: "🪨"
  },
  "sentient-testnet": {
    name: "Sentient Testnet",
    id: 1184075182,
    url: "https://sentient-testnet.hypersync.xyz",
    tier: "🪨"
  },
  sepolia: {
    name: "Sepolia",
    id: 11155111,
    url: "https://sepolia.hypersync.xyz",
    tier: "🎒"
  },
  "shimmer-evm": {
    name: "Shimmer EVM",
    id: 148,
    url: "https://shimmer-evm.hypersync.xyz",
    tier: "🪨"
  },
  soneium: {
    name: "Soneium",
    id: 1868,
    url: "https://soneium.hypersync.xyz",
    tier: "🪨"
  },
  sonic: {
    name: "Sonic",
    id: 146,
    url: "https://sonic.hypersync.xyz",
    tier: "🪨"
  },
  sophon: {
    name: "Sophon",
    id: 50104,
    url: "https://sophon.hypersync.xyz",
    tier: "🪨"
  },
  "sophon-testnet": {
    name: "Sophon Testnet",
    id: 531050104,
    url: "https://sophon-testnet.hypersync.xyz",
    tier: "🎒"
  },
  superseed: {
    name: "Superseed",
    id: 5330,
    url: "https://superseed.hypersync.xyz",
    tier: "🪨"
  },
  swell: {
    name: "Swell",
    id: 1923,
    url: "https://swell.hypersync.xyz",
    tier: "🪨"
  },
  tangle: {
    name: "Tangle",
    id: 5845,
    url: "https://tangle.hypersync.xyz",
    tier: "🪨"
  },
  taraxa: {
    name: "Taraxa",
    id: 841,
    url: "https://taraxa.hypersync.xyz",
    tier: "🥉"
  },
  unichain: {
    name: "Unichain",
    id: 130,
    url: "https://unichain.hypersync.xyz",
    tier: "🪨"
  },
  "unichain-sepolia": {
    name: "Unichain Sepolia",
    id: 1301,
    url: "https://unichain-sepolia.hypersync.xyz",
    tier: "🎒"
  },
  worldchain: {
    name: "Worldchain",
    id: 480,
    url: "https://worldchain.hypersync.xyz",
    tier: "🪨"
  },
  xdc: {
    name: "XDC",
    id: 50,
    url: "https://xdc.hypersync.xyz",
    tier: "🥈"
  },
  "xdc-testnet": {
    name: "XDC Testnet",
    id: 51,
    url: "https://xdc-testnet.hypersync.xyz",
    tier: "🎒"
  },
  zeta: {
    name: "Zeta",
    id: 7000,
    url: "https://zeta.hypersync.xyz",
    tier: "🪨"
  },
  zircuit: {
    name: "Zircuit",
    id: 48900,
    url: "https://zircuit.hypersync.xyz",
    tier: "🪨"
  },
  zksync: {
    name: "ZKsync",
    id: 324,
    url: "https://zksync.hypersync.xyz",
    tier: "🥉"
  },
  zora: {
    name: "Zora",
    id: 7777777,
    url: "https://zora.hypersync.xyz",
    tier: "🪨"
  }
};

export function getNetworkByName(name: string): NetworkConfig | undefined {
  return NETWORKS[name.toLowerCase()];
}

export function getNetworkById(id: number): NetworkConfig | undefined {
  return Object.values(NETWORKS).find(network => network.id === id);
}

export function getAllNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS);
}

export function getNetworksByTier(tier: string): NetworkConfig[] {
  return Object.values(NETWORKS).filter(network => network.tier === tier);
}