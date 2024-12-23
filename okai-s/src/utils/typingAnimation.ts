// Ultra-fast typing delay (microseconds)
export function getTypingDelay(): number {
  return 3; // 10 microseconds between words
}

// Split text into words for typing animation
export function splitIntoTypingChunks(text: string): string[] {
  // Split into words, preserving punctuation and spaces
  return text.match(/\S+|\s+/g) || [];
}