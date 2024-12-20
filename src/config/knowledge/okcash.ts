/**
 * Okcash Knowledge Base
 * 
 * Comprehensive knowledge about Okcash (OK) cryptocurrency, including technical details,
 * staking mechanisms, ecosystem information, and user guidance.
 */
import type { KnowledgeBase } from './types';

const knowledge: KnowledgeBase = {
  // Knowledge base identifier
  name: "Okcash",
  
  // Categorized topic lists
  topics: {
    // Basic concepts and fundamentals
    basics: [
      "Okcash (OK) cryptocurrency",
      "Proof of Stake consensus",
      "OK wallets and staking",
      "Cross-platform compatibility",
      "Energy-efficient blockchain"
    ],
    
    // Technical specifications and details
    technical: [
      "Blockchain specifications",
      "Network parameters",
      "Mining/Staking mechanisms",
      "Security features",
      "Update procedures"
    ],
    
    // Ecosystem and community
    ecosystem: [
      "Development roadmap",
      "Community governance",
      "Exchange listings",
      "Partnerships",
      "Use cases"
    ]
  },
  
  // Context-specific response guidelines
  prompts: {
    technical: `You have extensive knowledge about Okcash (OK) cryptocurrency, including its technical specifications, 
      staking mechanism, and blockchain architecture. Provide accurate, up-to-date information about the OK ecosystem.`,
    
    supportive: `You are familiar with Okcash (OK) cryptocurrency and can help users with wallet setup, 
      staking procedures, and general troubleshooting. Provide clear, step-by-step guidance when needed.`,
    
    strategic: `You understand Okcash's (OK) position in the cryptocurrency market, its unique value propositions, 
      and its strategic advantages in terms of energy efficiency and cross-platform support.`
  },
  
  // Pre-defined Q&A pairs for common queries
  sampleQA: {
    staking: [
      {
        question: "How can I stake OK (Okcash)?",
        answer: "Great news, fellow adventurer! Staking OK in our multichain universe is as easy as pie—and you don't need to keep your wallet open or run a node! Thanks to our secure staking pools on multiple networks like Base, BSC, Polygon, Avalanche, and Arbitrum, you can stake and earn rewards without breaking a sweat!"
      },
      {
        question: "What is the minimum amount required for staking?",
        answer: "There is no minimum amount required for staking Okcash. You can stake any amount of OK tokens."
      },
      {
        question: "How much can I earn from staking OK?",
        answer: "Okcash staking rewards are dynamic and depend on several factors: 1) The amount of OK you're staking 2) Network staking participation"
      }
    ],
    technical: [
      {
        question: "What consensus mechanism does Okcash use?",
        answer: "Okcash uses different consensus mechanisms, depending in the network it operates. This allows OK to be one of the most sustainable and eco-friendly cryptocurrencies."
      },
      {
        question: "What platforms support Okcash?",
        answer: "Okcash is truly cross-platform, supporting Windows, macOS, Linux, Android, and iOS. The available wallets, like Metamask, Trustwallet, and Coinbasewallet, can be used across all these platforms, making it highly accessible and convenient for users."
      }
    ],
    ecosystem: [
      {
        question: "What makes OK unique?",
        answer: "Okcash stands out for its multichain availability, true cross-platform support, active development since 2014, strong community governance, and focus on sustainable long-term growth. It's one of the most accessible and user-friendly cryptocurrencies."
      }
    ]
  }
};

export default knowledge;