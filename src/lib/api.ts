export interface BibleBook {
  id: string;
  name: string;
  englishName: string;
  testament: 'AT' | 'NT';
  category: string;
  chaptersCount: number;
  abbreviations: string[];
}

export interface VerseRecord {
  id: string;
  translation: 'LSG' | 'KJV';
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  rawText?: string;
  strongs?: string[];
  crossRefs?: string[];
}

export interface ChapterData {
  book: BibleBook;
  chapter: number;
  translation: 'LSG' | 'KJV';
  verses: VerseRecord[];
}

export interface DictionaryEntry {
  id: string;
  term: string;
  definition: string;
  biblicalSignificance: string;
  references: string[];
  associatedConcepts: string[];
  associatedCharacters: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  presentation: string;
  family: string;
  era: string;
  keyEvents: string[];
  references: string[];
  associatedCharacters: string[];
  teachings: string[];
}

export interface BibleStory {
  id: string;
  title: string;
  category: string;
  summary: string;
  characters: string[];
  timeline: string;
  references: string[];
  lessons: string[];
  questions: string[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: string;
  days: { day: number; title: string; passages: string[] }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reference: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  questions: QuizQuestion[];
}

export interface Devotional {
  id: string;
  dateKey: string;
  verseRef: string;
  verseText: string;
  translation: string;
  title: string;
  reflection: string;
  teaching: string;
  practicalApplication: string;
  question: string;
  prayer: string;
}

export interface AiChatResponse {
  agentType: string;
  agentName: string;
  answer: string;
  ragReferences: string[];
}

export const api = {
  async getBooks(): Promise<BibleBook[]> {
    const res = await fetch('/api/bible/books');
    const data = await res.json();
    return data.books;
  },

  async getChapter(bookId: string, chapter: number, translation: 'LSG' | 'KJV' = 'LSG'): Promise<ChapterData> {
    const res = await fetch(`/api/bible/chapter?bookId=${bookId}&chapter=${chapter}&translation=${translation}`);
    return await res.json();
  },

  async getVerse(bookId: string, chapter: number, verse: number, translation: 'LSG' | 'KJV' = 'LSG'): Promise<VerseRecord | null> {
    try {
      const res = await fetch(`/api/bible/verse?bookId=${bookId}&chapter=${chapter}&verse=${verse}&translation=${translation}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.verse || null;
    } catch {
      return null;
    }
  },

  async search(query: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<VerseRecord[]> {
    const res = await fetch('/api/bible/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, translation }),
    });
    const data = await res.json();
    return data.results || [];
  },

  async getDictionary(query = ''): Promise<DictionaryEntry[]> {
    const res = await fetch(`/api/bible/dictionary?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.entries || [];
  },

  async getCharacters(query = ''): Promise<CharacterProfile[]> {
    const res = await fetch(`/api/bible/characters?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.characters || [];
  },

  async getStories(category = 'Toutes'): Promise<BibleStory[]> {
    const res = await fetch(`/api/bible/stories?category=${encodeURIComponent(category)}`);
    const data = await res.json();
    return data.stories || [];
  },

  async getPlans(): Promise<ReadingPlan[]> {
    const res = await fetch('/api/bible/plans');
    const data = await res.json();
    return data.plans || [];
  },

  async getQuizzes(): Promise<QuizTopic[]> {
    const res = await fetch('/api/bible/quizzes');
    const data = await res.json();
    return data.quizzes || [];
  },

  async getTodayDevotional(): Promise<Devotional> {
    const res = await fetch('/api/bible/devotional/today');
    const data = await res.json();
    return data.devotional;
  },

  async chatWithAi(prompt: string, agentType?: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, agentType, translation }),
    });
    return await res.json();
  },

  async explainVerse(bookName: string, chapter: number, verse: number, text: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/explain-verse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookName, chapter, verse, text, translation }),
    });
    return await res.json();
  },

  async generateStudy(topic: string, duration: string, level: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/generate-study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, duration, level, translation }),
    });
    return await res.json();
  },

  async generatePrayer(theme: string, passage: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/generate-prayer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, passage, translation }),
    });
    return await res.json();
  },

  async generateVideoScript(topic: string, duration: string, targetAudience: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/generate-video-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, duration, targetAudience, translation }),
    });
    return await res.json();
  },

  async generateContent(topic: string, contentType: string, tone: string, translation: 'LSG' | 'KJV' = 'LSG'): Promise<AiChatResponse> {
    const res = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, contentType, tone, translation }),
    });
    return await res.json();
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data.stats;
  }
};
