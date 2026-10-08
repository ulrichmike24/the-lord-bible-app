import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config
const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function syncGenesisAndBooks() {
  console.log(`Starting Firestore sync on database: ${firebaseConfig.firestoreDatabaseId}...`);

  // 1. Sync Books
  const booksPath = path.resolve(__dirname, '../public/bible-data/books.json');
  const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
  console.log(`Syncing ${books.length} Bible books...`);

  for (const book of books) {
    try {
      await setDoc(doc(db, 'bibleBooks', book.id), {
        id: book.id,
        name: book.name,
        englishName: book.englishName,
        bookNumber: book.bookNumber,
        testament: book.testament,
        category: book.category,
        chaptersCount: book.chaptersCount,
        abbreviations: book.abbreviations,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error(`Error saving book ${book.id}:`, err);
    }
  }
  console.log('Bible books synced successfully!');

  // 2. Sync Genesis chapters (1 to 50)
  const genPath = path.resolve(__dirname, '../public/bible-data/lsg-json/GEN.json');
  if (fs.existsSync(genPath)) {
    const genData = JSON.parse(fs.readFileSync(genPath, 'utf8'));
    console.log(`Syncing Genesis (${Object.keys(genData.chapters).length} chapters)...`);
    
    for (const [chapStr, verses] of Object.entries(genData.chapters)) {
      const chapNum = parseInt(chapStr, 10);
      const chapterId = `GEN_${chapNum}`;
      const versesArray = (verses as any[]).map((v: any) => ({
        id: `LSG_GEN_${chapNum}_${v.verse}`,
        bookId: 'GEN',
        bookName: 'Genèse',
        chapter: chapNum,
        verse: v.verse,
        text: v.text || '',
        rawText: v.rawText || '',
        strongs: v.strongs || [],
        crossRefs: v.crossRefs || []
      }));

      try {
        await setDoc(doc(db, 'bibleChapters', chapterId), {
          id: chapterId,
          bookId: 'GEN',
          bookName: 'Genèse',
          chapter: chapNum,
          translation: 'LSG',
          versesCount: versesArray.length,
          verses: versesArray,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`Chapter GEN ${chapNum} saved (${versesArray.length} verses).`);
      } catch (err) {
        console.error(`Error saving chapter ${chapterId}:`, err);
      }
    }
    console.log('Genesis completely synced to Firestore!');
  }

  // 3. Sync Gospel of John (JHN) chapters as well for instant reading
  const jhnPath = path.resolve(__dirname, '../public/bible-data/lsg-json/JHN.json');
  if (fs.existsSync(jhnPath)) {
    const jhnData = JSON.parse(fs.readFileSync(jhnPath, 'utf8'));
    console.log(`Syncing Gospel of John (${Object.keys(jhnData.chapters).length} chapters)...`);
    
    for (const [chapStr, verses] of Object.entries(jhnData.chapters)) {
      const chapNum = parseInt(chapStr, 10);
      const chapterId = `JHN_${chapNum}`;
      const versesArray = (verses as any[]).map((v: any) => ({
        id: `LSG_JHN_${chapNum}_${v.verse}`,
        bookId: 'JHN',
        bookName: 'Jean',
        chapter: chapNum,
        verse: v.verse,
        text: v.text || '',
        rawText: v.rawText || '',
        strongs: v.strongs || [],
        crossRefs: v.crossRefs || []
      }));

      try {
        await setDoc(doc(db, 'bibleChapters', chapterId), {
          id: chapterId,
          bookId: 'JHN',
          bookName: 'Jean',
          chapter: chapNum,
          translation: 'LSG',
          versesCount: versesArray.length,
          verses: versesArray,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error(`Error saving chapter ${chapterId}:`, err);
      }
    }
    console.log('Gospel of John synced to Firestore!');
  }

  process.exit(0);
}

syncGenesisAndBooks().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
