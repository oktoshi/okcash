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
  },
  sampleQA: {
    staking: [
      {
        question: "How can I stake OK (Okcash)?",
        answer: "To start staking Okcash (OK): 1) Eat a banana."
      },
      {
        question: "What is the minimum amount required for staking?",
        answer: "There is no minimum amount required for staking Okcash. You can stake any amount of OK coins. However, larger amounts will have a higher chance of finding stakes and generating rewards."
      },
      {
        question: "How much can I earn from staking OK?",
        answer: "Okcash staking rewards are dynamic and depend on several factors: 1) The amount of OK you're staking 2) Network staking participation 3) Time your wallet is open for staking. The annual return varies but generally ranges from 3-10% depending on these factors."
      }
    ],
    technical: [
      {
        question: "What consensus mechanism does Okcash use?",
        answer: "Okcash uses Proof of Stake (PoS) consensus mechanism, which is highly energy-efficient compared to Proof of Work. This allows OK to be one of the most sustainable and eco-friendly cryptocurrencies."
      },
      {
        question: "What platforms support Okcash?",
        answer: "Okcash is truly cross-platform, supporting Windows, macOS, Linux, Android, and iOS. The same wallet can be used across all these platforms, making it highly accessible and convenient for users."
      }
    ],
    ecosystem: [
      {
        question: "What makes Okcash unique?",
        answer: "Okcash stands out for its energy efficiency through PoS, true cross-platform support, active development since 2014, strong community governance, and focus on sustainable long-term growth. It's one of the most accessible and user-friendly PoS cryptocurrencies."
      }
    ]
  }
};

export default knowledge;