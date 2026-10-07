import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIBLE_BOOKS, findBookByNameOrAbbr } from './server/bible-data/books.ts';
import { CANONICAL_VERSES, getChapterVerses, getChapterVersesAsync, searchVerses } from './server/bible-data/verses-db.ts';
import { BIBLE_DICTIONARY } from './server/bible-data/dictionary-db.ts';
import { BIBLE_CHARACTERS } from './server/bible-data/characters-db.ts';
import { BIBLE_STORIES } from './server/bible-data/stories-db.ts';
import { READING_PLANS } from './server/bible-data/plans-db.ts';
import { BIBLE_QUIZZES } from './server/bible-data/quizzes-db.ts';
import { getTodayDevotional } from './server/bible-data/devotionals-db.ts';
import { processBibleAiRequest, AgentType } from './server/ai/ai-manager.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory stats for admin dashboard
let stats = {
  totalVersesRead: 1420,
  totalAiQueries: 285,
  totalStudiesGenerated: 64,
  totalQuizAttempts: 112,
  totalContentDrafts: 37
};

// --- BIBLE API ---
app.get('/api/bible/books', (req: Request, res: Response) => {
  res.json({ books: BIBLE_BOOKS });
});

app.get('/api/bible/chapter', async (req: Request, res: Response) => {
  const bookId = (req.query.bookId as string) || 'JHN';
  const chapter = parseInt(req.query.chapter as string || '3', 10);
  const translation = (req.query.translation as 'LSG' | 'KJV') || 'LSG';

  stats.totalVersesRead += 1;
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
    stats.totalVersesRead += 1;
    res.json({ verse: found });
  } else {
    res.status(404).json({ error: 'Verset non trouvé dans la base locale.' });
  }
});

app.post('/api/bible/search', (req: Request, res: Response) => {
  const { query, translation = 'LSG' } = req.body;
  if (!query) {
    res.status(400).json({ error: 'La requête de recherche est requise.' });
    return;
  }

  const results = searchVerses(query, translation, 25);
  res.json({ query, results });
});

// --- DICTIONARY, CHARACTERS, STORIES, PLANS, QUIZZES ---
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

// --- GEMINI & BIBLE AI AGENTS ---
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { prompt, agentType, translation = 'LSG' } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Le prompt est requis.' });
    return;
  }

  stats.totalAiQueries += 1;
  const result = await processBibleAiRequest(prompt, agentType as AgentType, translation);
  res.json(result);
});

app.post('/api/ai/explain-verse', async (req: Request, res: Response) => {
  const { bookName, chapter, verse, text, translation = 'LSG' } = req.body;
  const prompt = `Explique en profondeur le verset biblique : ${bookName} ${chapter}:${verse} (${translation}). Texte : "${text}". Fournis l'exégèse complète, le contexte historique, les enseignements spirituels et l'application pratique.`;

  stats.totalAiQueries += 1;
  const result = await processBibleAiRequest(prompt, 'verse_explanation', translation);
  res.json(result);
});

app.post('/api/ai/generate-study', async (req: Request, res: Response) => {
  const { topic, duration = '30 minutes', level = 'Débutant', translation = 'LSG' } = req.body;
  const prompt = `Génère une étude biblique complète et théologiquement structurée sur le sujet : "${topic}". Durée d'étude visée : ${duration}. Niveau : ${level}.`;

  stats.totalAiQueries += 1;
  stats.totalStudiesGenerated += 1;
  const result = await processBibleAiRequest(prompt, 'study', translation);
  res.json(result);
});

app.post('/api/ai/generate-prayer', async (req: Request, res: Response) => {
  const { theme, passage, translation = 'LSG' } = req.body;
  const prompt = `Rédige une prière scripturaire fervente, humble et inspirée de la Parole de Dieu sur le thème : "${theme}". Passage biblique d'ancrage : "${passage}".`;

  stats.totalAiQueries += 1;
  const result = await processBibleAiRequest(prompt, 'prayer', translation);
  res.json(result);
});

app.post('/api/ai/generate-video-script', async (req: Request, res: Response) => {
  const { topic, duration = '3 minutes', targetAudience = 'Grand public', translation = 'LSG' } = req.body;
  const prompt = `Crée un script vidéo professionnel pour les réseaux sociaux (YouTube / Reels) sur le sujet : "${topic}". Durée estimée : ${duration}. Public cible : ${targetAudience}. Inclus le hook, les visuels à l'écran, la narration, les références bibliques, et l'appel à l'action.`;

  stats.totalAiQueries += 1;
  stats.totalContentDrafts += 1;
  const result = await processBibleAiRequest(prompt, 'video_script', translation);
  res.json(result);
});

app.post('/api/ai/generate-content', async (req: Request, res: Response) => {
  const { topic, contentType = 'article', tone = 'pastoral', translation = 'LSG' } = req.body;
  const prompt = `Rédige un contenu chrétien d'édification (type : ${contentType}, ton : ${tone}) sur le sujet : "${topic}".`;

  stats.totalAiQueries += 1;
  stats.totalContentDrafts += 1;
  const result = await processBibleAiRequest(prompt, 'content', translation);
  res.json(result);
});

// --- ADMIN STATS & PROMPTS ---
app.get('/api/admin/stats', (req: Request, res: Response) => {
  res.json({ stats });
});

// --- STATIC OR DEV VITE SERVER ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BIBLE AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
