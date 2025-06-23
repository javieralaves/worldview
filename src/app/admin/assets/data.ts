export interface AssetEntry {
  name: string;
  ticker: string;
  contract: string;
  issuer: string;
  price: number;
  priceSource: string;
  compositions: string;
  amountNest: number;
  amountUsd: number;
  estApy: number;
  currApy: number;
  apyDiff: number;
  yieldReceived: number;
  yieldExpected: number;
  yieldCycle: string;
  lastPaid: string;
  nextPayout: string;
  jurisdiction: string;
  legal: string;
  redemption: string;
  scorecard: string;
  underwriter: string;
}

export const integratedAssets: AssetEntry[] = [
  {
    name: "Mineral Vault",
    ticker: "MNRL",
    contract: "0x1111111111111111111111111111111111111111",
    issuer: "Mineral",
    price: 1.23,
    priceSource: "https://example.com/mineral",
    compositions: "Nest Credit",
    amountNest: 50000,
    amountUsd: 61500,
    estApy: 8.7,
    currApy: 8.5,
    apyDiff: -0.2,
    yieldReceived: 5000,
    yieldExpected: 5200,
    yieldCycle: "Monthly",
    lastPaid: "2024-06-01",
    nextPayout: "2024-07-01",
    jurisdiction: "US",
    legal: "SPV",
    redemption: "7 days",
    scorecard: "https://example.com/scorecard/mnrl",
    underwriter: "Cicada Partners",
  },
  {
    name: "iSNR",
    ticker: "iSNR",
    contract: "0x2222222222222222222222222222222222222222",
    issuer: "Invesco",
    price: 1.08,
    priceSource: "https://example.com/isnr",
    compositions: "Nest Alpha",
    amountNest: 30000,
    amountUsd: 32400,
    estApy: 6.0,
    currApy: 6.1,
    apyDiff: 0.1,
    yieldReceived: 2500,
    yieldExpected: 2400,
    yieldCycle: "Quarterly",
    lastPaid: "2024-05-15",
    nextPayout: "2024-08-15",
    jurisdiction: "US",
    legal: "Reg D",
    redemption: "14 days",
    scorecard: "https://example.com/scorecard/isnr",
    underwriter: "Cicada Partners",
  },
];

export const pendingAssets: AssetEntry[] = [
  {
    name: "mBASIS",
    ticker: "MBASIS",
    contract: "0x3333333333333333333333333333333333333333",
    issuer: "M DAO",
    price: 0.92,
    priceSource: "https://example.com/mbasis",
    compositions: "",
    amountNest: 0,
    amountUsd: 0,
    estApy: 7.1,
    currApy: 0,
    apyDiff: 0,
    yieldReceived: 0,
    yieldExpected: 0,
    yieldCycle: "Monthly",
    lastPaid: "-",
    nextPayout: "-",
    jurisdiction: "SG",
    legal: "DAO",
    redemption: "-",
    scorecard: "https://example.com/scorecard/mbasis",
    underwriter: "Cicada Partners",
  },
];
