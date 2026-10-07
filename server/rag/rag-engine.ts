import { BIBLE_BOOKS, findBookByNameOrAbbr } from '../bible-data/books.ts';
import { CANONICAL_VERSES, VerseRecord, searchVerses, getChapterVerses } from '../bible-data/verses-db.ts';
import { BIBLE_DICTIONARY, DictionaryEntry } from '../bible-data/dictionary-db.ts';
import { BIBLE_CHARACTERS, CharacterProfile } from '../bible-data/characters-db.ts';
import { BIBLE_STORIES, BibleStory } from '../bible-data/stories-db.ts';

export interface RagContext {
  explicitVerses: VerseRecord[];
  topicalVerses: VerseRecord[];
  dictionaryEntries: DictionaryEntry[];
  characterProfiles: CharacterProfile[];
  stories: BibleStory[];
  formattedContext: string;
}

export function extractBibleReferences(text: string): { bookId: string; bookName: string; chapter: number; verse?: number }[] {
  const references: { bookId: string; bookName: string; chapter: number; verse?: number }[] = [];

  // Patterns such as: "Jean 3:16", "Psaume 23:1", "1 Corinthiens 13:4", "Rom 8:28"
  const refRegex = /([1-3]?\s*[A-Za-zÀ-ÿ]+)\s+(\d+)[\s:,]+(\d+)?/gi;
  let match;

  while ((match = refRegex.exec(text)) !== null) {
    const rawBook = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = match[3] ? parseInt(match[3], 10) : undefined;

    const book = findBookByNameOrAbbr(rawBook);
    if (book && chapter > 0 && chapter <= book.chaptersCount) {
      references.push({
        bookId: book.id,
        bookName: book.name,
        chapter,
        verse
      });
    }
  }

  return references;
}

export function buildRagContext(userQuery: string, translation: 'LSG' | 'KJV' = 'LSG'): RagContext {
  const normQuery = userQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Check explicit references
  const extractedRefs = extractBibleReferences(userQuery);
  const explicitVerses: VerseRecord[] = [];

  for (const ref of extractedRefs) {
    if (ref.verse) {
      let found = CANONICAL_VERSES.find(
        v => v.bookId === ref.bookId && v.chapter === ref.chapter && v.verse === ref.verse && v.translation === translation
      );
      if (!found) {
        const chVerses = getChapterVerses(ref.bookId, ref.chapter, translation);
        found = chVerses.find(v => v.verse === ref.verse);
      }
      if (found) explicitVerses.push(found);
    } else {
      const chapterVerses = getChapterVerses(ref.bookId, ref.chapter, translation).slice(0, 8);
      explicitVerses.push(...chapterVerses);
    }
  }

  // 2. Topical and keyword scripture search across the whole Bible
  const topicalVerses = searchVerses(userQuery, translation, 10).filter(
    tv => !explicitVerses.some(ev => ev.id === tv.id)
  );

  // 3. Theological dictionary lookup
  const dictionaryEntries = BIBLE_DICTIONARY.filter(d => {
    const termNorm = d.term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normQuery.includes(termNorm) || termNorm.includes(normQuery);
  });

  // 4. Character profiles lookup
  const characterProfiles = BIBLE_CHARACTERS.filter(c => {
    const charNorm = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normQuery.includes(charNorm);
  });

  // 5. Stories lookup
  const stories = BIBLE_STORIES.filter(s => {
    const storyNorm = s.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normQuery.includes(storyNorm);
  });

  // Format contextual payload
  const contextParts: string[] = [];

  if (explicitVerses.length > 0) {
    contextParts.push('=== PASSAGES BIBLIQUES EXACTS EXTRAITS DE LA BASE DE DONNÉES (SOURCE VÉRIFIÉE) ===');
    explicitVerses.forEach(v => {
      let line = `[${v.bookName} ${v.chapter}:${v.verse} (${v.translation})] "${v.text}"`;
      if (v.strongs && v.strongs.length > 0) {
        line += ` [Numéros Strong: ${v.strongs.join(', ')}]`;
      }
      if (v.crossRefs && v.crossRefs.length > 0) {
        line += ` [Références croisées: ${v.crossRefs.join(', ')}]`;
      }
      contextParts.push(line);
    });
  }

  if (topicalVerses.length > 0) {
    contextParts.push('\n=== PASSAGES BIBLIQUES TROUVÉS PAR RECHERCHE SCRIPTURAIRE (RÉSULTATS DE RECHERCHE) ===');
    topicalVerses.forEach(v => {
      let line = `[${v.bookName} ${v.chapter}:${v.verse} (${v.translation})] "${v.text}"`;
      if (v.strongs && v.strongs.length > 0) {
        line += ` [Numéros Strong: ${v.strongs.join(', ')}]`;
      }
      if (v.crossRefs && v.crossRefs.length > 0) {
        line += ` [Références croisées: ${v.crossRefs.join(', ')}]`;
      }
      contextParts.push(line);
    });
  }

  if (dictionaryEntries.length > 0) {
    contextParts.push('\n=== ENTRÉES DU DICTIONNAIRE THÉOLOGIQUE DE RÉFÉRENCE ===');
    dictionaryEntries.forEach(d => {
      contextParts.push(`Terme: ${d.term}\nDéfinition: ${d.definition}\nSignification biblique: ${d.biblicalSignificance}\nRéférences: ${d.references.join(', ')}`);
    });
  }

  if (characterProfiles.length > 0) {
    contextParts.push('\n=== BIOGRAPHIES DE PERSONNAGES BIBLIQUES VÉRIFIÉES ===');
    characterProfiles.forEach(c => {
      contextParts.push(`Nom: ${c.name} (${c.era})\nPrésentation: ${c.presentation}\nFamille: ${c.family}\nÉvénements clés: ${c.keyEvents.join('; ')}\nEnseignements: ${c.teachings.join('; ')}`);
    });
  }

  if (stories.length > 0) {
    contextParts.push('\n=== RÉCITS ET HISTOIRES BIBLIQUES DE RÉFÉRENCE ===');
    stories.forEach(s => {
      contextParts.push(`Titre: ${s.title} (${s.timeline})\nRésumé: ${s.summary}\nLeçons: ${s.lessons.join('; ')}\nRéférences: ${s.references.join(', ')}`);
    });
  }

  return {
    explicitVerses,
    topicalVerses,
    dictionaryEntries,
    characterProfiles,
    stories,
    formattedContext: contextParts.join('\n\n')
  };
}
