import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { BIBLE_BOOKS, findBookByNameOrAbbr } from '../server/bible-data/books.ts';
import { CANONICAL_VERSES, getChapterVerses, getChapterVersesAsync, searchVerses } from '../server/bible-data/verses-db.ts';
import { BIBLE_DICTIONARY } from '../server/bible-data/dictionary-db.ts';
import { BIBLE_CHARACTERS } from '../server/bible-data/characters-db.ts';
import { BIBLE_STORIES } from '../server/bible-data/stories-db.ts';
import { READING_PLANS } from '../server/bible-data/plans-db.ts';
import { BIBLE_QUIZZES } from '../server/bible-data/quizzes-db.ts';
import { getTodayDevotional } from '../server/bible-data/devotionals-db.ts';
import { processBibleAiRequest, AgentType } from '../server/ai/ai-manager.ts';

dotenv.config();

const app = express();
app.use(express.json());

// CORS for cross-origin or local requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Bible API
app.get('/api/bible/books', (req: Request, res: Response) => {
  res.json({ books: BIBLE_BOOKS });
});

app.get('/api/bible/chapter', async (req: Request, res: Response) => {
  const bookId = (req.query.bookId as string) || 'JHN';
  const chapter = parseInt(req.query.chapter as string || '3', 10);
  const translation = (req.query.translation as 'LSG' | 'KJV') || 'LSG';

  const verses = await getChapterVersesAsync(bookId, chapter, translation);
  const book = BIBLE_BOOKS.find(b => b.id === bookId);

  res.json({
    book,
    chapter,
    translation,
    verses
  });
});

app.get('/api/bible/verse', async (req: Request, res: Response) => {
  const bookId = (req.query.bookId as string) || 'JHN';
  const chapter = parseInt(req.query.chapter as string || '3', 10);
  const verse = parseInt(req.query.verse as string || '16', 10);
  const translation = (req.query.translation as 'LSG' | 'KJV') || 'LSG';

  let found = CANONICAL_VERSES.find(
    v => v.bookId === bookId && v.chapter === chapter && v.verse === verse && v.translation === translation
  );

  if (!found) {
    const chapterVerses = await getChapterVersesAsync(bookId, chapter, translation);
    found = chapterVerses.find(v => v.verse === verse);
  }

  if (found) {
    res.json({ verse: found });
  } else {
    res.status(404).json({ error: 'Verset non trouvé.' });
  }
});

app.post('/api/bible/search', (req: Request, res: Response) => {
  const { query, translation = 'LSG' } = req.body;
  if (!query) {
    res.status(400).json({ error: 'La requête est requise.' });
    return;
  }
  const results = searchVerses(query, translation, 25);
  res.json({ query, results });
});

app.get('/api/bible/dictionary', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    res.json({ entries: BIBLE_DICTIONARY });
    return;
  }
  const filtered = BIBLE_DICTIONARY.filter(d =>
    d.term.toLowerCase().includes(query) || d.definition.toLowerCase().includes(query)
  );
  res.json({ entries: filtered });
});

app.get('/api/bible/characters', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    res.json({ characters: BIBLE_CHARACTERS });
    return;
  }
  const filtered = BIBLE_CHARACTERS.filter(c =>
    c.name.toLowerCase().includes(query) || c.presentation.toLowerCase().includes(query)
  );
  res.json({ characters: filtered });
});

app.get('/api/bible/stories', (req: Request, res: Response) => {
  const category = req.query.category as string;
  if (!category || category === 'Toutes') {
    res.json({ stories: BIBLE_STORIES });
    return;
  }
  const filtered = BIBLE_STORIES.filter(s => s.category === category);
  res.json({ stories: filtered });
});

app.get('/api/bible/plans', (req: Request, res: Response) => {
  res.json({ plans: READING_PLANS });
});

app.get('/api/bible/quizzes', (req: Request, res: Response) => {
  res.json({ quizzes: BIBLE_QUIZZES });
});

app.get('/api/bible/devotional/today', (req: Request, res: Response) => {
  res.json({ devotional: getTodayDevotional() });
});

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { prompt, agentType, translation = 'LSG' } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Le prompt est requis.' });
    return;
  }
  const result = await processBibleAiRequest(prompt, agentType as AgentType, translation);
  res.json(result);
});

app.post('/api/ai/explain-verse', async (req: Request, res: Response) => {
  const { bookName, chapter, verse, text, translation = 'LSG' } = req.body;
  const prompt = `Explique en profondeur le verset biblique : ${bookName} ${chapter}:${verse} (${translation}). Texte : "${text}". Fournis l'exégèse complète, le contexte historique, les enseignements spirituels et l'application pratique.`;
  const result = await processBibleAiRequest(prompt, 'verse_explanation', translation);
  res.json(result);
});

export default app;
