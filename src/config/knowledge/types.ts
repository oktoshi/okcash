export interface QandA {
  question: string;
  answer: string;
}

export interface KnowledgeBase {
  name: string;
  topics: {
    [key: string]: string[];
  };
  prompts: {
    [key: string]: string;
  };
  sampleQA?: {
    [category: string]: QandA[];
  };
}