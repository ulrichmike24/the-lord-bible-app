import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import cfg from '../firebase-applet-config.json';

const app = initializeApp(cfg);
const db = getFirestore(app, cfg.firestoreDatabaseId);

async function syncGenesisToFirestore() {
  const genData = JSON.parse(fs.readFileSync('server/bible-data/lsg-json/GEN.json', 'utf-8'));

  console.log('Syncing Genesis metadata to Firestore...');
  await setDoc(doc(db, 'bibleBooks', 'GEN'), {
    id: 'GEN',
    name: 'Genèse',
    englishName: 'Genesis',
    testament: 'AT',
    chaptersCount: 50,
    hasStrongs: true,
    hasCrossRefs: true,
    updatedAt: new Date().toISOString()
  });

  console.log('Syncing chapters to Firestore /bibleChapters...');
  // Upload chapters (batch/sequential)
  for (let c = 1; c <= 50; c++) {
    const verses = genData.chapters[c.toString()] || [];
    const chapDocRef = doc(db, 'bibleChapters', `GEN_${c}`);
    await setDoc(chapDocRef, {
      bookId: 'GEN',
      bookName: 'Genèse',
      chapter: c,
      versesCount: verses.length,
      // Store verses with clean text, Strongs, and references
      verses: verses.map((v: any) => ({
        verse: v.verse,
        text: v.text,
        strongs: v.strongs || [],
        crossRefs: v.crossRefs || []
      })),
      updatedAt: new Date().toISOString()
    });
    if (c % 10 === 0 || c === 50) {
      console.log(`Synced up to Chapter ${c} in Firestore.`);
    }
  }

  console.log('Genesis completely integrated into Firebase Firestore!');
}

syncGenesisToFirestore()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error syncing Genesis to Firestore:', err);
    process.exit(1);
  });
