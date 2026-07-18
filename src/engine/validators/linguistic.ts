export function checkPassiveVoice(text: string): number {
  const passiveVoiceHeuristic = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|built|made|done|seen)\b/gi;
  const matches = text.match(passiveVoiceHeuristic);
  const totalWords = text.split(/\s+/).length;
  if (totalWords === 0) return 100;
  
  const passiveCount = matches ? matches.length : 0;
  // Score drops by 10 for every 1% of passive voice
  const passivePercentage = (passiveCount / totalWords) * 100;
  return Math.max(0, 100 - (passivePercentage * 10));
}

export function checkParagraphLengths(text: string): boolean {
  // A heuristic: split by newlines, check word count per paragraph
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  for (const p of paragraphs) {
    if (p.split(/\s+/).length > 100) return false; // Over 100 words in one block is too long
  }
  return true;
}

export function calculateReadTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200)); // standard 200 WPM
}

export function calculateReadingLevel(text: string, wordCount: number): string {
  if (wordCount === 0) return "N/A";
  const sentences = text.split(/[.!?]+/).length || 1;
  const syllables = text.split(/[aeiouy]+/).length || 1; // very rough heuristic for syllables
  
  // Flesch-Kincaid Grade Level rough approximation
  const score = 0.39 * (wordCount / sentences) + 11.8 * (syllables / wordCount) - 15.59;
  
  if (score < 6) return "Easy";
  if (score < 10) return "Intermediate";
  return "Advanced";
}
