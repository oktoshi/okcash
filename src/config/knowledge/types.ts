export interface KnowledgeBase {
  name: string;
  topics: {
    [key: string]: string[];
  };
  prompts: {
    [key: string]: string;
  };
}