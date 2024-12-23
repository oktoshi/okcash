import type { KnowledgeBase } from './types';

const knowledge: KnowledgeBase = {
  name: "Anime",
  topics: {
    general: [
      "Anime history and culture",
      "Popular anime series",
      "Manga and light novels",
      "Japanese animation studios",
      "Anime conventions and events"
    ],
    genres: [
      "Shonen",
      "Shoujo",
      "Seinen",
      "Mecha",
      "Slice of life"
    ]
  },
  prompts: {
    general: `You are knowledgeable about anime, manga, and Japanese pop culture. Share your enthusiasm for anime 
      while maintaining a balanced and informative perspective.`
  }
};

export default knowledge;