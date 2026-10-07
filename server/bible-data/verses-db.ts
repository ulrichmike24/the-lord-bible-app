import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIBLE_BOOKS } from './books.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LSG_JSON_DIR = path.resolve(__dirname, 'lsg-json');

const lsgBookCache = new Map<string, any>();

export function loadLsgBook(bookId: string) {
  if (lsgBookCache.has(bookId)) {
    return lsgBookCache.get(bookId);
  }
  const filePath = path.join(LSG_JSON_DIR, `${bookId}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      lsgBookCache.set(bookId, data);
      return data;
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }
  return null;
}

export interface VerseRecord {
  id: string; // e.g. "LSG_JHN_3_16"
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

export const CANONICAL_VERSES: VerseRecord[] = [
  // --- JEAN 3 (LSG & KJV) ---
  {
    id: 'LSG_JHN_3_1',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 1,
    text: 'Mais il y eut un homme d\'entre les pharisiens, nommé Nicodème, un chef des Juifs,'
  },
  {
    id: 'LSG_JHN_3_2',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 2,
    text: 'qui vint, lui, auprès de Jésus, de nuit, et lui dit: Rabbi, nous savons que tu es un docteur venu de Dieu; car personne ne peut faire ces miracles que tu fais, si Dieu n\'est avec lui.'
  },
  {
    id: 'LSG_JHN_3_3',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 3,
    text: 'Jésus lui répondit: En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu.'
  },
  {
    id: 'LSG_JHN_3_4',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 4,
    text: 'Nicodème lui dit: Comment un homme peut-il naître quand il est vieux? Peut-il rentrer dans le sein de sa mère et naître?'
  },
  {
    id: 'LSG_JHN_3_5',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 5,
    text: 'Jésus répondit: En vérité, en vérité, je te le dis, si un homme ne naît d\'eau et d\'Esprit, il ne peut entrer dans le royaume de Dieu.'
  },
  {
    id: 'LSG_JHN_3_6',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 6,
    text: 'Ce qui est né de la chair est chair, et ce qui est né de l\'Esprit est esprit.'
  },
  {
    id: 'LSG_JHN_3_7',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 7,
    text: 'Ne t\'étonne pas que je t\'aie dit: Il faut que vous naissiez de nouveau.'
  },
  {
    id: 'LSG_JHN_3_8',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 8,
    text: 'Le vent souffle où il veut, et tu en entends le bruit; mais tu ne sais d\'où il vient, ni où il va. Il en est ainsi de tout homme qui est né de l\'Esprit.'
  },
  {
    id: 'LSG_JHN_3_9',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 9,
    text: 'Nicodème lui dit: Comment cela peut-il se faire?'
  },
  {
    id: 'LSG_JHN_3_10',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 10,
    text: 'Jésus lui répondit: Tu es le docteur d\'Israël, et tu ne sais pas ces choses!'
  },
  {
    id: 'LSG_JHN_3_11',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 11,
    text: 'En vérité, en vérité, je te le dis, nous disons ce que nous savons, et nous rendons témoignage de ce que nous avons vu; et vous ne recevez pas notre témoignage.'
  },
  {
    id: 'LSG_JHN_3_12',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 12,
    text: 'Si vous ne croyez pas quand je vous ai parlé des choses terrestres, comment croirez-vous quand je vous parlerai des choses célestes?'
  },
  {
    id: 'LSG_JHN_3_13',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 13,
    text: 'Personne n\'est monté au ciel, si ce n\'est celui qui est descendu du ciel, le Fils de l\'homme qui est dans le ciel.'
  },
  {
    id: 'LSG_JHN_3_14',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 14,
    text: 'Et comme Moïse éleva le serpent dans le désert, il faut de même que le Fils de l\'homme soit élevé,'
  },
  {
    id: 'LSG_JHN_3_15',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 15,
    text: 'afin que quiconque croit en lui ait la vie éternelle.'
  },
  {
    id: 'LSG_JHN_3_16',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 16,
    text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.'
  },
  {
    id: 'KJV_JHN_3_16',
    translation: 'KJV',
    bookId: 'JHN',
    bookName: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
  },
  {
    id: 'LSG_JHN_3_17',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 17,
    text: 'Dieu, en effet, n\'a pas envoyé son Fils dans le monde pour qu\'il juge le monde, mais pour que le monde soit sauvé par lui.'
  },
  {
    id: 'LSG_JHN_3_18',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 18,
    text: 'Celui qui croit en lui n\'est point jugé; mais celui qui ne croit pas est déjà jugé, parce qu\'il n\'a pas cru au nom du Fils unique de Dieu.'
  },
  {
    id: 'LSG_JHN_3_19',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 19,
    text: 'Et ce jugement c\'est que, la lumière étant venue dans le monde, les hommes ont préféré les ténèbres à la lumière, parce que leurs oeuvres étaient mauvaises.'
  },
  {
    id: 'LSG_JHN_3_20',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 20,
    text: 'Car quiconque fait le mal hait la lumière, et ne vient point à la lumière, de peur que ses oeuvres ne soient dévoilées;'
  },
  {
    id: 'LSG_JHN_3_21',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 3,
    verse: 21,
    text: 'mais celui qui agit selon la vérité vient à la lumière, afin que ses oeuvres soient manifestées, parce qu\'elles sont faites en Dieu.'
  },

  // --- PSAUME 23 (LSG & KJV) ---
  {
    id: 'LSG_PSA_23_1',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 1,
    text: 'L\'Éternel est mon berger: je ne manquerai de rien.'
  },
  {
    id: 'KJV_PSA_23_1',
    translation: 'KJV',
    bookId: 'PSA',
    bookName: 'Psalms',
    chapter: 23,
    verse: 1,
    text: 'The LORD is my shepherd; I shall not want.'
  },
  {
    id: 'LSG_PSA_23_2',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 2,
    text: 'Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.'
  },
  {
    id: 'LSG_PSA_23_3',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 3,
    text: 'Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom.'
  },
  {
    id: 'LSG_PSA_23_4',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 4,
    text: 'Quand je marche dans la vallée de l\'ombre de la mort, Je ne crains aucun mal, car tu es avec moi: Ta houlette et ton bâton me rassurent.'
  },
  {
    id: 'LSG_PSA_23_5',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 5,
    text: 'Tu dresses devant moi une table, en face de mes adversaires; Tu oins d\'huile ma tête, et ma coupe déborde.'
  },
  {
    id: 'LSG_PSA_23_6',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    verse: 6,
    text: 'Oui, le bonheur et la grâce m\'accompagneront tous les jours de ma vie, Et j\'habiterai dans la maison de l\'Éternel jusqu\'à la fin de mes jours.'
  },

  // --- GENÈSE 1 ---
  {
    id: 'LSG_GEN_1_1',
    translation: 'LSG',
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    verse: 1,
    text: 'Au commencement, Dieu créa les cieux et la terre.'
  },
  {
    id: 'KJV_GEN_1_1',
    translation: 'KJV',
    bookId: 'GEN',
    bookName: 'Genesis',
    chapter: 1,
    verse: 1,
    text: 'In the beginning God created the heaven and the earth.'
  },
  {
    id: 'LSG_GEN_1_2',
    translation: 'LSG',
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    verse: 2,
    text: 'La terre était informe et vide: il y avait des ténèbres à la surface de l\'abîme, et l\'esprit de Dieu se mouvait au-dessus des eaux.'
  },
  {
    id: 'LSG_GEN_1_3',
    translation: 'LSG',
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    verse: 3,
    text: 'Dieu dit: Que la lumière soit! Et la lumière fut.'
  },
  {
    id: 'LSG_GEN_1_26',
    translation: 'LSG',
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    verse: 26,
    text: 'Puis Dieu dit: Faisons l\'homme à notre image, selon notre ressemblance, et qu\'il domine sur les poissons de la mer, sur les oiseaux du ciel, sur le bétail, sur toute la terre, et sur tous les reptiles qui rampent sur la terre.'
  },
  {
    id: 'LSG_GEN_1_27',
    translation: 'LSG',
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    verse: 27,
    text: 'Dieu créa l\'homme à son image, il le créa à l\'image de Dieu, il créa l\'homme et la femme.'
  },

  // --- EXODE 20 (Les 10 Commandements) ---
  {
    id: 'LSG_EXO_20_1',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 1,
    text: 'Alors Dieu prononça toutes ces paroles, en disant:'
  },
  {
    id: 'LSG_EXO_20_2',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 2,
    text: 'Je suis l\'Éternel, ton Dieu, qui t\'ai fait sortir du pays d\'Égypte, de la maison de servitude.'
  },
  {
    id: 'LSG_EXO_20_3',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 3,
    text: 'Tu n\'auras pas d\'autres dieux devant ma face.'
  },
  {
    id: 'LSG_EXO_20_7',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 7,
    text: 'Tu ne prendras point le nom de l\'Éternel, ton Dieu, en vain; car l\'Éternel ne laissera point impuni celui qui prendra son nom en vain.'
  },
  {
    id: 'LSG_EXO_20_8',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 8,
    text: 'Souviens-toi du jour du repos, pour le sanctifier.'
  },
  {
    id: 'LSG_EXO_20_12',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 12,
    text: 'Honore ton père et ta mère, afin que tes jours se prolongent dans le pays que l\'Éternel, ton Dieu, te donne.'
  },
  {
    id: 'LSG_EXO_20_13',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 13,
    text: 'Tu ne tueras point.'
  },
  {
    id: 'LSG_EXO_20_14',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 14,
    text: 'Tu ne commettras point d\'adultère.'
  },
  {
    id: 'LSG_EXO_20_15',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 15,
    text: 'Tu ne déroberas point.'
  },
  {
    id: 'LSG_EXO_20_16',
    translation: 'LSG',
    bookId: 'EXO',
    bookName: 'Exode',
    chapter: 20,
    verse: 16,
    text: 'Tu ne porteras point de faux témoignage contre ton prochain.'
  },

  // --- PSAUME 91 ---
  {
    id: 'LSG_PSA_91_1',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 91,
    verse: 1,
    text: 'Celui qui demeure sous l\'abri du Très-Haut Repose à l\'ombre du Tout Puissant.'
  },
  {
    id: 'LSG_PSA_91_2',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 91,
    verse: 2,
    text: 'Je dis à l\'Éternel: Mon refuge et ma forteresse, Mon Dieu en qui je me confie!'
  },
  {
    id: 'LSG_PSA_91_11',
    translation: 'LSG',
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 91,
    verse: 11,
    text: 'Car il ordonnera à ses anges De te garder dans toutes tes voies;'
  },

  // --- PROVERBES 3 ---
  {
    id: 'LSG_PRO_3_5',
    translation: 'LSG',
    bookId: 'PRO',
    bookName: 'Proverbes',
    chapter: 3,
    verse: 5,
    text: 'Confie-toi en l\'Éternel de tout ton coeur, Et ne t\'appuie pas sur ta sagesse;'
  },
  {
    id: 'LSG_PRO_3_6',
    translation: 'LSG',
    bookId: 'PRO',
    bookName: 'Proverbes',
    chapter: 3,
    verse: 6,
    text: 'Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.'
  },

  // --- ÉSAÏE 40 & 53 ---
  {
    id: 'LSG_ISA_40_31',
    translation: 'LSG',
    bookId: 'ISA',
    bookName: 'Ésaïe',
    chapter: 40,
    verse: 31,
    text: 'Mais ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se lassent point; Ils marchent, et ne se fatiguent point.'
  },
  {
    id: 'LSG_ISA_53_5',
    translation: 'LSG',
    bookId: 'ISA',
    bookName: 'Ésaïe',
    chapter: 53,
    verse: 5,
    text: 'Mais il était blessé pour nos péchés, Brisé pour nos iniquités; Le châtiment qui nous donne la paix est tombé sur lui, Et c\'est par ses meurtrissures que nous sommes guéris.'
  },

  // --- JÉRÉMIE 29:11 ---
  {
    id: 'LSG_JER_29_11',
    translation: 'LSG',
    bookId: 'JER',
    bookName: 'Jérémie',
    chapter: 29,
    verse: 11,
    text: 'Car je connais les projets que j\'ai formés sur vous, dit l\'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l\'espérance.'
  },

  // --- MATTHIEU 5 (Béatitudes) & MATTHIEU 6 (Notre Père) ---
  {
    id: 'LSG_MAT_5_3',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 3,
    text: 'Heureux les pauvres en esprit, car le royaume des cieux est à eux!'
  },
  {
    id: 'LSG_MAT_5_4',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 4,
    text: 'Heureux les affligés, car ils seront consolés!'
  },
  {
    id: 'LSG_MAT_5_5',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 5,
    text: 'Heureux les débonnaires, car ils hériteront la terre!'
  },
  {
    id: 'LSG_MAT_5_6',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 6,
    text: 'Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés!'
  },
  {
    id: 'LSG_MAT_5_7',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 7,
    text: 'Heureux les miséricordieux, car ils obtiendront miséricorde!'
  },
  {
    id: 'LSG_MAT_5_8',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 8,
    text: 'Heureux ceux qui ont le coeur pur, car ils verront Dieu!'
  },
  {
    id: 'LSG_MAT_5_9',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 9,
    text: 'Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu!'
  },
  {
    id: 'LSG_MAT_5_14',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    verse: 14,
    text: 'Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée;'
  },
  {
    id: 'LSG_MAT_6_9',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 9,
    text: 'Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié;'
  },
  {
    id: 'LSG_MAT_6_10',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 10,
    text: 'que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel.'
  },
  {
    id: 'LSG_MAT_6_11',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 11,
    text: 'Donne-nous aujourd\'hui notre pain quotidien;'
  },
  {
    id: 'LSG_MAT_6_12',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 12,
    text: 'pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés;'
  },
  {
    id: 'LSG_MAT_6_13',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 13,
    text: 'ne nous induis pas en tentation, mais délivre-nous du malin. Car c\'est à toi qu\'appartiennent, dans tous les siècles, le règne, la puissance et la gloire. Amen!'
  },
  {
    id: 'LSG_MAT_6_33',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 6,
    verse: 33,
    text: 'Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.'
  },
  {
    id: 'LSG_MAT_28_19',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 28,
    verse: 19,
    text: 'Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint Esprit,'
  },
  {
    id: 'LSG_MAT_28_20',
    translation: 'LSG',
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 28,
    verse: 20,
    text: 'et enseignez-leur à observer tout ce que je vous ai prescrit. Et voici, je suis avec vous tous les jours, jusqu\'à la fin du monde.'
  },

  // --- JEAN 1 ---
  {
    id: 'LSG_JHN_1_1',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 1,
    verse: 1,
    text: 'Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.'
  },
  {
    id: 'KJV_JHN_1_1',
    translation: 'KJV',
    bookId: 'JHN',
    bookName: 'John',
    chapter: 1,
    verse: 1,
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.'
  },
  {
    id: 'LSG_JHN_1_14',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 1,
    verse: 14,
    text: 'Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père.'
  },
  {
    id: 'LSG_JHN_14_6',
    translation: 'LSG',
    bookId: 'JHN',
    bookName: 'Jean',
    chapter: 14,
    verse: 6,
    text: 'Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.'
  },

  // --- ROMAINS 8 ---
  {
    id: 'LSG_ROM_8_1',
    translation: 'LSG',
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    verse: 1,
    text: 'Il n\'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus Christ.'
  },
  {
    id: 'LSG_ROM_8_28',
    translation: 'LSG',
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    verse: 28,
    text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.'
  },
  {
    id: 'KJV_ROM_8_28',
    translation: 'KJV',
    bookId: 'ROM',
    bookName: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.'
  },
  {
    id: 'LSG_ROM_8_31',
    translation: 'LSG',
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    verse: 31,
    text: 'Que dirons-nous donc à l\'égard de ces choses? Si Dieu est pour nous, qui sera contre nous?'
  },
  {
    id: 'LSG_ROM_8_38',
    translation: 'LSG',
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    verse: 38,
    text: 'Car j\'ai l\'assurance que ni la mort ni la vie, ni les anges ni les dominations, ni les choses présentes ni les choses à venir,'
  },
  {
    id: 'LSG_ROM_8_39',
    translation: 'LSG',
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    verse: 39,
    text: 'ni la hauteur, ni la profondeur, ni aucune autre créature ne pourra nous séparer de l\'amour de Dieu manifesté en Jésus Christ notre Seigneur.'
  },

  // --- 1 CORINTHIENS 13 (L'Amour) ---
  {
    id: 'LSG_1CO_13_4',
    translation: 'LSG',
    bookId: '1CO',
    bookName: '1 Corinthiens',
    chapter: 13,
    verse: 4,
    text: 'La charité est patiente, elle est pleine de bonté; la charité n\'est point envieuse; la charité ne se vante point, elle ne s\'enfle point d\'orgueil,'
  },
  {
    id: 'LSG_1CO_13_7',
    translation: 'LSG',
    bookId: '1CO',
    bookName: '1 Corinthiens',
    chapter: 13,
    verse: 7,
    text: 'elle excuse tout, elle croit tout, elle espère tout, elle supporte tout.'
  },
  {
    id: 'LSG_1CO_13_13',
    translation: 'LSG',
    bookId: '1CO',
    bookName: '1 Corinthiens',
    chapter: 13,
    verse: 13,
    text: 'Maintenant donc ces trois choses demeurent: la foi, l\'espérance, la charité; mais la plus grande de ces choses, c\'est la charité.'
  },

  // --- ÉPHÉSIENS 2 & 6 ---
  {
    id: 'LSG_EPH_2_8',
    translation: 'LSG',
    bookId: 'EPH',
    bookName: 'Éphésiens',
    chapter: 2,
    verse: 8,
    text: 'Car c\'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c\'est le don de Dieu.'
  },
  {
    id: 'LSG_EPH_2_9',
    translation: 'LSG',
    bookId: 'EPH',
    bookName: 'Éphésiens',
    chapter: 2,
    verse: 9,
    text: 'Ce n\'est point par les oeuvres, afin que personne ne se glorifie.'
  },
  {
    id: 'LSG_EPH_2_10',
    translation: 'LSG',
    bookId: 'EPH',
    bookName: 'Éphésiens',
    chapter: 2,
    verse: 10,
    text: 'Car nous sommes son ouvrage, ayant été créés en Jésus Christ pour de bonnes oeuvres, que Dieu a préparées d\'avance, afin que nous les pratiquions.'
  },
  {
    id: 'LSG_EPH_6_11',
    translation: 'LSG',
    bookId: 'EPH',
    bookName: 'Éphésiens',
    chapter: 6,
    verse: 11,
    text: 'Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.'
  },

  // --- PHILIPPIENS 4 ---
  {
    id: 'LSG_PHP_4_6',
    translation: 'LSG',
    bookId: 'PHP',
    bookName: 'Philippiens',
    chapter: 4,
    verse: 6,
    text: 'Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.'
  },
  {
    id: 'LSG_PHP_4_7',
    translation: 'LSG',
    bookId: 'PHP',
    bookName: 'Philippiens',
    chapter: 4,
    verse: 7,
    text: 'Et la paix de Dieu, qui surpasse toute intelligence, gardera vos coeurs et vos pensées en Jésus Christ.'
  },
  {
    id: 'LSG_PHP_4_13',
    translation: 'LSG',
    bookId: 'PHP',
    bookName: 'Philippiens',
    chapter: 4,
    verse: 13,
    text: 'Je puis tout par celui qui me fortifie.'
  },
  {
    id: 'KJV_PHP_4_13',
    translation: 'KJV',
    bookId: 'PHP',
    bookName: 'Philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all things through Christ which strengtheneth me.'
  },

  // --- HÉBREUX 11 ---
  {
    id: 'LSG_HEB_11_1',
    translation: 'LSG',
    bookId: 'HEB',
    bookName: 'Hébreux',
    chapter: 11,
    verse: 1,
    text: 'Or la foi est une ferme assurance des choses qu\'on espère, une démonstration de celles qu\'on ne voit pas.'
  },
  {
    id: 'KJV_HEB_11_1',
    translation: 'KJV',
    bookId: 'HEB',
    bookName: 'Hebrews',
    chapter: 11,
    verse: 1,
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.'
  },
  {
    id: 'LSG_HEB_11_6',
    translation: 'LSG',
    bookId: 'HEB',
    bookName: 'Hébreux',
    chapter: 11,
    verse: 6,
    text: 'Or sans la foi il est impossible de lui être agréable; car il faut que celui qui s\'approche de Dieu croie que Dieu existe, et qu\'il est le rémunérateur de ceux qui le cherchent.'
  },

  // --- 2 TIMOTHÉE 3:16-17 ---
  {
    id: 'LSG_2TI_3_16',
    translation: 'LSG',
    bookId: '2TI',
    bookName: '2 Timothée',
    chapter: 3,
    verse: 16,
    text: 'Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice,'
  },
  {
    id: 'LSG_2TI_3_17',
    translation: 'LSG',
    bookId: '2TI',
    bookName: '2 Timothée',
    chapter: 3,
    verse: 17,
    text: 'afin que l\'homme de Dieu soit accompli et propre à toute bonne oeuvre.'
  },

  // --- JACQUES 1:5 ---
  {
    id: 'LSG_JAS_1_5',
    translation: 'LSG',
    bookId: 'JAS',
    bookName: 'Jacques',
    chapter: 1,
    verse: 5,
    text: 'Si quelqu\'un d\'entre vous manque de sagesse, qu\'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.'
  },

  // --- 1 JEAN 4:8 & 4:18 ---
  {
    id: 'LSG_1JN_4_8',
    translation: 'LSG',
    bookId: '1JN',
    bookName: '1 Jean',
    chapter: 4,
    verse: 8,
    text: 'Celui qui n\'aime pas n\'a pas connu Dieu, car Dieu est amour.'
  },
  {
    id: 'LSG_1JN_4_18',
    translation: 'LSG',
    bookId: '1JN',
    bookName: '1 Jean',
    chapter: 4,
    verse: 18,
    text: 'La crainte n\'est pas dans l\'amour, mais l\'amour parfait bannit la crainte; car la crainte suppose un châtiment, et celui qui craint n\'est pas parfait dans l\'amour.'
  },

  // --- APOCALYPSE 3:20 & 21:4 ---
  {
    id: 'LSG_REV_3_20',
    translation: 'LSG',
    bookId: 'REV',
    bookName: 'Apocalypse',
    chapter: 3,
    verse: 20,
    text: 'Voici, je me tiens à la porte, et je frappe. Si quelqu\'un entend ma voix et ouvre la porte, j\'entrerai chez lui, je souperai avec lui, et lui avec moi.'
  },
  {
    id: 'LSG_REV_21_4',
    translation: 'LSG',
    bookId: 'REV',
    bookName: 'Apocalypse',
    chapter: 21,
    verse: 4,
    text: 'Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n\'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.'
  }
];

const chapterCache = new Map<string, VerseRecord[]>();

export async function getChapterVersesAsync(
  bookId: string,
  chapter: number,
  translation: 'LSG' | 'KJV' = 'LSG'
): Promise<VerseRecord[]> {
  const cacheKey = `${translation}_${bookId}_${chapter}`;
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) return [];

  // 1. If translation is LSG, load directly from converted official USFM-JSON files
  if (translation === 'LSG') {
    const bookData = loadLsgBook(bookId);
    if (bookData && bookData.chapters && bookData.chapters[chapter.toString()]) {
      const verses: VerseRecord[] = bookData.chapters[chapter.toString()].map((item: any) => ({
        id: `LSG_${bookId}_${chapter}_${item.verse}`,
        translation: 'LSG',
        bookId,
        bookName: book.name,
        chapter,
        verse: item.verse,
        text: item.text,
        rawText: item.rawText,
        strongs: item.strongs,
        crossRefs: item.crossRefs,
      }));
      chapterCache.set(cacheKey, verses);
      return verses;
    }
  }

  // 2. Check pre-seeded canonical verses
  const matchingCanonical = CANONICAL_VERSES.filter(
    v => v.bookId === bookId && v.chapter === chapter && v.translation === translation
  ).sort((a, b) => a.verse - b.verse);

  if (matchingCanonical.length >= 20) {
    chapterCache.set(cacheKey, matchingCanonical);
    return matchingCanonical;
  }

  // 3. For KJV or remote fallback
  try {
    if (translation === 'KJV') {
      try {
        const res = await fetch(`https://bible-api.com/${encodeURIComponent(book.englishName)}+${chapter}?translation=kjv`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.verses) && data.verses.length > 0) {
            const fetchedVerses: VerseRecord[] = data.verses.map((item: any) => ({
              id: `KJV_${bookId}_${chapter}_${item.verse}`,
              translation: 'KJV',
              bookId,
              bookName: book.englishName,
              chapter,
              verse: item.verse,
              text: (item.text || '').trim(),
            }));
            chapterCache.set(cacheKey, fetchedVerses);
            return fetchedVerses;
          }
        }
      } catch (err) {
        const res2 = await fetch(`https://bolls.life/get-chapter/KJV/${book.bookNumber}/${chapter}/`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res2.ok) {
          const data2 = await res2.json();
          if (Array.isArray(data2) && data2.length > 0) {
            const fetchedVerses: VerseRecord[] = data2.map((item: any) => ({
              id: `KJV_${bookId}_${chapter}_${item.verse}`,
              translation: 'KJV',
              bookId,
              bookName: book.englishName,
              chapter,
              verse: item.verse,
              text: (item.text || '').replace(/<S>\d+<\/S>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
            }));
            chapterCache.set(cacheKey, fetchedVerses);
            return fetchedVerses;
          }
        }
      }
    }
  } catch (fetchErr) {
    console.warn(`[Bible Fetcher] Remote fetch error for ${book.name} ${chapter}:`, fetchErr);
  }

  // Fallback to canonical verses if available
  if (matchingCanonical.length > 0) {
    return matchingCanonical;
  }

  return [];
}

export function getChapterVerses(bookId: string, chapter: number, translation: 'LSG' | 'KJV' = 'LSG'): VerseRecord[] {
  const cacheKey = `${translation}_${bookId}_${chapter}`;
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (translation === 'LSG') {
    const bookData = loadLsgBook(bookId);
    if (bookData && bookData.chapters && bookData.chapters[chapter.toString()]) {
      const verses: VerseRecord[] = bookData.chapters[chapter.toString()].map((item: any) => ({
        id: `LSG_${bookId}_${chapter}_${item.verse}`,
        translation: 'LSG',
        bookId,
        bookName: book?.name || bookId,
        chapter,
        verse: item.verse,
        text: item.text,
        rawText: item.rawText,
        strongs: item.strongs,
        crossRefs: item.crossRefs,
      }));
      chapterCache.set(cacheKey, verses);
      return verses;
    }
  }

  return CANONICAL_VERSES.filter(
    v => v.bookId === bookId && v.chapter === chapter && v.translation === translation
  ).sort((a, b) => a.verse - b.verse);
}

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'en', 'est', 'qui', 'que',
  'pour', 'sur', 'par', 'dans', 'ce', 'cette', 'il', 'elle', 'ils', 'elles', 'au', 'aux',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos',
  'avec', 'comment', 'pourquoi', 'quand', 'quel', 'quelle', 'quels', 'quelles', 'the', 'and',
  'is', 'of', 'to', 'in', 'that', 'it', 'for', 'on', 'with', 'as', 'at', 'ai', 'as', 'a',
  'suis', 'es', 'sommes', 'etes', 'sont', 'faire', 'fait', 'dit', 'dis', 'dire'
]);

export function searchVerses(query: string, translation: 'LSG' | 'KJV' = 'LSG', limit = 25): VerseRecord[] {
  const normQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (!normQuery) return [];

  // Extract individual meaningful search keywords
  const rawWords = normQuery.split(/[\s,.;:!?«»"'()\-–—]+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));

  const results: VerseRecord[] = [];
  const scoredMap = new Map<string, { verse: VerseRecord; score: number }>();

  function evaluateVerse(v: VerseRecord) {
    const textNorm = v.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const bookNorm = v.bookName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let score = 0;
    // Exact phrase match gets highest bonus
    if (textNorm.includes(normQuery)) {
      score += 100;
    } else if (bookNorm.includes(normQuery)) {
      score += 80;
    }

    // Strong's code match
    if (v.strongs && v.strongs.some(s => s.toLowerCase() === normQuery)) {
      score += 90;
    }

    // Word matches
    for (const word of rawWords) {
      if (textNorm.includes(word)) {
        score += 15;
      }
      if (bookNorm.includes(word)) {
        score += 10;
      }
      if (v.strongs && v.strongs.some(s => s.toLowerCase().includes(word))) {
        score += 20;
      }
      if (v.crossRefs && v.crossRefs.some(cr => cr.toLowerCase().includes(word))) {
        score += 10;
      }
    }

    if (score > 0) {
      if (!scoredMap.has(v.id) || scoredMap.get(v.id)!.score < score) {
        scoredMap.set(v.id, { verse: v, score });
      }
    }
  }

  // 1. Search in canonical verses
  for (const v of CANONICAL_VERSES) {
    if (v.translation === translation) {
      evaluateVerse(v);
    }
  }

  // 2. If translation is LSG, search inside loaded LSG JSON books (Genesis, Gospels, etc.)
  if (translation === 'LSG') {
    for (const book of BIBLE_BOOKS) {
      const bookData = loadLsgBook(book.id);
      if (!bookData || !bookData.chapters) continue;

      for (const [chapStr, chapVerses] of Object.entries(bookData.chapters as Record<string, any[]>)) {
        const chapNum = parseInt(chapStr, 10);
        for (const item of chapVerses) {
          const verseRec: VerseRecord = {
            id: `LSG_${book.id}_${chapNum}_${item.verse}`,
            translation: 'LSG',
            bookId: book.id,
            bookName: book.name,
            chapter: chapNum,
            verse: item.verse,
            text: item.text || '',
            rawText: item.rawText,
            strongs: item.strongs,
            crossRefs: item.crossRefs,
          };
          evaluateVerse(verseRec);
        }
      }
    }
  }

  // Sort by relevance score descending
  const sorted = Array.from(scoredMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.verse);

  return sorted;
}
