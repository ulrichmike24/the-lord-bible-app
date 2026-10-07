export interface Devotional {
  id: string;
  dateKey: string; // e.g. "2026-10-06"
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

export const DEVOTIONALS: Devotional[] = [
  {
    id: 'dev-1',
    dateKey: '2026-10-06',
    verseRef: 'Psaume 23:1-3',
    verseText: 'L\'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles. Il restaure mon âme.',
    translation: 'Louis Segond (LSG 1910)',
    title: 'La paix au cœur de la tempête',
    reflection: 'Dans un monde agité où le bruit et les exigences quotidiennes nous submergent, David nous rappelle une vérité fondamentale : notre sécurité ne repose pas sur nos ressources matérielles, mais sur la fidélité de notre Berger divin. Lorsque Dieu conduit, il pourvoit non seulement au pain quotidien, mais aussi au repos intérieur de l\'âme.',
    teaching: 'Le Berger ne conduit pas seulement vers des buts lointains, Il s\'arrête pour restaurer ce qui est épuisé et blessé. La restauration spirituelle exige que nous cessions nos propres agitations pour écouter la voix douce du Bon Berger.',
    practicalApplication: 'Prenez 10 minutes aujourd\'hui, sans écran ni distractions. Remettez à Dieu les trois soucis majeurs qui pèsent sur votre esprit en confessant : « Seigneur, Tu es mon berger, je choisis de te faire confiance ».',
    question: 'Dans quel domaine de votre vie tentez-vous encore d\'être votre propre berger au lieu de lâcher prise devant Dieu ?',
    prayer: 'Seigneur Jésus, Bon Berger de mon âme, je Te remercie car Tu me connais intimement par mon nom. Guide mes pas aujourd\'hui, apaise mes angoisses et conduis-moi près de Tes eaux paisibles. Restaure mes forces et que ma vie Te rende gloire. Amen.'
  },
  {
    id: 'dev-2',
    dateKey: '2026-10-07',
    verseRef: 'Philippiens 4:6-7',
    verseText: 'Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos coeurs et vos pensées en Jésus Christ.',
    translation: 'Louis Segond (LSG 1910)',
    title: 'Transformer l\'inquiétude en adoration',
    reflection: 'L\'apôtre Paul écrit ces lignes depuis une prison romaine. Pourtant, il ne parle ni d\'amertume ni de panique, mais d\'une paix surnaturelle. La paix divine n\'est pas l\'absence d\'épreuves, mais la présence tangible de Dieu au sein même des difficultés.',
    teaching: 'La formule biblique contre l\'anxiété est claire : remplacer le ressassement mental par la supplication accompagnée d\'actions de grâces. La gratitude réaligne notre perspective sur la grandeur de Dieu.',
    practicalApplication: 'Écrivez sur un carnet trois grâces reçues cette semaine avant de présenter votre requête la plus urgente à Dieu.',
    question: 'Qu\'est-ce qui vous empêche d\'avoir un cœur reconnaissant au milieu de vos défis actuels ?',
    prayer: 'Père céleste, je dépose à Tes pieds toute anxiété qui trouble mon cœur. Remplis mon esprit de Ta paix qui surpasse toute compréhension humaine. Merci pour Ta bonté qui ne s\'épuise jamais. Au nom de Jésus, Amen.'
  }
];

export function getTodayDevotional(): Devotional {
  const today = new Date().toISOString().slice(0, 10);
  const found = DEVOTIONALS.find(d => d.dateKey === today);
  return found || DEVOTIONALS[0];
}
