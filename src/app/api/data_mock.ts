// Helper function to generate normal distribution
function normalRandom(mean: number, stdDev: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Function to generate random activity data for the last 30 days
const generateActivityData = (startDate: number) => {
  const activityData = [];
  const start = new Date(startDate);
  for (let i = 0; i < 30; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    // Generate more natural distribution using normal distribution
    const views = Math.max(0, Math.floor(normalRandom(500, 200)));
    const clicks = Math.max(0, Math.floor(normalRandom(50, 20)));
    const conversions = Math.max(0, Math.floor(normalRandom(5, 2)));

    activityData.push({
      date: date.toISOString().split("T")[0],
      views,
      clicks,
      conversions,
    });
  }
  return activityData;
};

export const campaigns = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Solana Merch Drop",
    description: "Exclusive blockchain-themed apparel for our community",
    imageUrl: "https://cryptowardrobe.com/cdn/shop/products/SOLANA_cryptocurrency_merchandise_merch_hoodie_white_1024x1024.jpg?v=1620045422",
    status: "active",
    slug: "web3-merch-drop-2024",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-08-15"),
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-15"),
    dailyData: generateActivityData(new Date("2024-07-15").getTime()),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Mad Lads x dVin Labs",
    description: "Claim your customized champagne bottle featuring exclusive Mad Lads artwork",
    imageUrl: "https://pbs.twimg.com/media/GYgvfIMXMAA8OJ9?format=png&name=small",
    status: "active",
    slug: "mad-lads-x-dvin-labs",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-09-30"),
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-08-15"),
    dailyData: generateActivityData(new Date("2024-08-15").getTime()),
  },
  {
    id: "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
    name: "MonkeDAO Community Event",
    description:
      "Exclusive gathering for MonkeDAO members with special NFT drops and community activities",
    imageUrl: "https://pbs.twimg.com/profile_images/1520205713221382144/TM27IHMP_400x400.jpg",
    status: "upcoming",
    slug: "monkedao-community-event-2024",
    startDate: new Date("2024-11-15"),
    endDate: new Date("2024-11-17"),
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),
    dailyData: generateActivityData(new Date("2024-10-01").getTime()),
  },
  {
    id: "c3d1e1f0-46b7-4d1a-b2d0-3b0c1d2e3f4a",
    name: "Solana Incubator Cohort 2",
    description:
      "Join the second cohort of Solana's incubator program for innovative blockchain projects",
    imageUrl: "https://pbs.twimg.com/media/GWFTsJMWAAAN20u?format=jpg&name=4096x4096",
    status: "upcoming",
    slug: "solana-incubator-cohort-2",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01"),
    dailyData: generateActivityData(new Date("2024-09-01").getTime()),
  },
];
