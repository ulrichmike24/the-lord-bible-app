import fs from 'fs';
import path from 'path';

function cleanUsfmText(text: string): string {
  let cleaned = text;
  // Remove cross-references \x ... \x*
  cleaned = cleaned.replace(/\\x\s+.*?(?:\\x\*|$)/g, ' ');
  cleaned = cleaned.replace(/\\x\*?/g, ' ');
  // Remove section titles and references if inside verse
  cleaned = cleaned.replace(/\\[msr]\d*\s+.*?(?=\\[a-z]|$)/g, ' ');
  // Replace words with strongs: \w word|strong="H1234"\w* -> word
  cleaned = cleaned.replace(/\\w\s+([^|]+)\|strong="[^"]*"\s*\\w\*/g, '$1');
  cleaned = cleaned.replace(/\\w\*?/g, '');
  // Remove formatting markers like \p, \q, \v \d+, etc.
  cleaned = cleaned.replace(/\\[a-z0-9]+\*?/g, ' ');
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Fix punctuation spacing
  cleaned = cleaned.replace(/\s+([,.:;?!])/g, '$1');
  cleaned = cleaned.replace(/([«])\s+/g, '$1');
  cleaned = cleaned.replace(/\s+([»])/g, '$1');
  return cleaned;
}

function extractStrongs(rawText: string): string[] {
  const matches = rawText.matchAll(/strong="([^"]+)"/g);
  const set = new Set<string>();
  for (const m of matches) {
    if (m[1]) set.add(m[1]);
  }
  return Array.from(set);
}

function extractCrossRefs(rawText: string): string[] {
  const refs: string[] = [];
  const matches = rawText.matchAll(/\\xt\s+([^\\*]+)/g);
  for (const m of matches) {
    if (m[1]) {
      const parts = m[1].split(/[;,.]\s*/);
      for (const p of parts) {
        const trimmed = p.trim();
        if (trimmed && trimmed.length > 2) refs.push(trimmed);
      }
    }
  }
  return refs;
}

export function parseGenesisUsfm(usfmFilePath: string) {
  const content = fs.readFileSync(usfmFilePath, 'utf-8');
  const lines = content.split('\n');

  let currentChapter = 0;
  const chapters: Record<string, any[]> = {};
  const chaptersArray: any[] = [];

  let currentVerseNum = 0;
  let currentVerseRaw = '';

  function flushVerse() {
    if (currentChapter > 0 && currentVerseNum > 0 && currentVerseRaw.trim()) {
      const clean = cleanUsfmText(currentVerseRaw);
      const strongs = extractStrongs(currentVerseRaw);
      const crossRefs = extractCrossRefs(currentVerseRaw);

      const verseObj = {
        verse: currentVerseNum,
        text: clean,
        rawText: currentVerseRaw.trim(),
        strongs: strongs.length > 0 ? strongs : undefined,
        crossRefs: crossRefs.length > 0 ? crossRefs : undefined
      };

      if (!chapters[currentChapter.toString()]) {
        chapters[currentChapter.toString()] = [];
      }
      chapters[currentChapter.toString()].push(verseObj);
    }
    currentVerseNum = 0;
    currentVerseRaw = '';
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Chapter header: \c 1
    const chapMatch = trimmed.match(/^\\c\s+(\d+)/);
    if (chapMatch) {
      flushVerse();
      currentChapter = parseInt(chapMatch[1], 10);
      continue;
    }

    if (currentChapter === 0) continue;

    // Verse marker: \v 1 text... or \p\v 1 text...
    const verseTokens = trimmed.split(/(?=\\v\s+\d+)/);
    for (const token of verseTokens) {
      const vMatch = token.match(/\\v\s+(\d+)\s*(.*)/);
      if (vMatch) {
        flushVerse();
        currentVerseNum = parseInt(vMatch[1], 10);
        currentVerseRaw = vMatch[2] || '';
      } else if (currentVerseNum > 0) {
        currentVerseRaw += ' ' + token;
      }
    }
  }

  flushVerse();

  // Also build chapters array format for users who prefer array of chapters
  for (let c = 1; c <= 50; c++) {
    const verses = chapters[c.toString()] || [];
    chaptersArray.push({
      chapter: c,
      verses
    });
  }

  return {
    id: 'GEN',
    bookId: 'GEN',
    name: 'Genèse',
    englishName: 'Genesis',
    testament: 'AT',
    chaptersCount: 50,
    chapters,
    chaptersList: chaptersArray
  };
}

const usfmPath = '/tmp/ebible/files/02-GENfraLSG.usfm';
if (fs.existsSync(usfmPath)) {
  const result = parseGenesisUsfm(usfmPath);
  console.log('Parsed Genesis:', result.name, 'Chapters:', Object.keys(result.chapters).length);
  console.log('Ch 1 verse 1 clean:', result.chapters['1'][0].text);
  console.log('Ch 1 verse 1 strongs:', result.chapters['1'][0].strongs);
  console.log('Ch 1 verse 1 crossRefs:', result.chapters['1'][0].crossRefs);
  console.log('Ch 50 verse 26 clean:', result.chapters['50'].slice(-1)[0].text);

  // Write to server/bible-data/lsg-json/GEN.json
  fs.writeFileSync('server/bible-data/lsg-json/GEN.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('Successfully updated server/bible-data/lsg-json/GEN.json');
} else {
  console.error('USFM file not found at:', usfmPath);
}
