import type { KnowledgeBase } from './types';

const knowledge: KnowledgeBase = {
  name: "Okcash",
  topics: {
    basics: [
      "Okcash (OK) cryptocurrency",
      "Proof of Stake consensus",
      "OK wallets and staking",
      "Cross-platform compatibility",
      "Energy-efficient blockchain"
    ],
    technical: [
      "Blockchain specifications",
      "Network parameters",
      "Mining/Staking mechanisms",
      "Security features",
      "Update procedures"
    ],
    ecosystem: [
      "Development roadmap",
      "Community governance",
      "Exchange listings",
      "Partnerships",
      "Use cases"
    ]
  },
  prompts: {
    technical: `You have extensive knowledge about Okcash (OK) cryptocurrency, including its technical specifications, 
      staking mechanism, and blockchain architecture. Provide accurate, up-to-date information about the OK ecosystem.`,
    supportive: `You are familiar with Okcash (OK) cryptocurrency and can help users with wallet setup, 
      staking procedures, and general troubleshooting. Provide clear, step-by-step guidance when needed.`,
    strategic: `You understand Okcash's (OK) position in the cryptocurrency market, its unique value propositions, 
      and its strategic advantages in terms of energy efficiency and cross-platform support.`
  }
};

export default knowledge;