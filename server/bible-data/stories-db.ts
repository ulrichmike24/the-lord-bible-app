export interface BibleStory {
  id: string;
  title: string;
  category: 'Ancien Testament' | 'Nouveau Testament' | 'Vie de Jésus' | 'Miracles' | 'Paraboles' | 'Apôtres';
  summary: string;
  characters: string[];
  timeline: string;
  references: string[];
  lessons: string[];
  questions: string[];
}

export const BIBLE_STORIES: BibleStory[] = [
  {
    id: 'creation',
    title: 'La Création du monde',
    category: 'Ancien Testament',
    summary: 'En six jours ordonnés par sa Parole créatrice, Dieu façonne les cieux, la terre, la lumière, la vie végétale, animale et l\'humanité à son image, avant de se reposer le septième jour.',
    characters: ['Dieu', 'Adam', 'Ève'],
    timeline: 'Origine des temps',
    references: ['Genèse 1:1–2:4', 'Psaume 104', 'Jean 1:1-3', 'Colossiens 1:16'],
    lessons: [
      'Dieu est l\'Auteur souverain et bienveillant de toute existence.',
      'L\'être humain a une dignité infinie, étant créé à l\'image et à la ressemblance de Dieu.',
      'Le sabbat rappelle la grâce du repos et la dépendance filiale envers le Créateur.'
    ],
    questions: [
      'Que signifie pour notre quotidien être créé à l\'image de Dieu ?',
      'Comment la contemplation de la création fortifie-t-elle notre foi ?'
    ]
  },
  {
    id: 'exode-mer-rouge',
    title: 'L\'Exode et la traversée de la mer Rouge',
    category: 'Ancien Testament',
    summary: 'Après les dix plaies d\'Égypte et l\'institution de la Pâque, Moïse conduit le peuple hébreu hors de l\'esclavage. Acculés devant la mer Rouge par l\'armée de Pharaon, Dieu fend les eaux pour offrir un passage à sec à son peuple.',
    characters: ['Moïse', 'Pharaon', 'Aaron', 'Le peuple d\'Israël'],
    timeline: '~1446 av. J.-C.',
    references: ['Exode 12–15', 'Psaume 106:9-12', 'Hébreux 11:29'],
    lessons: [
      'Quand il n\'y a plus d\'issue humaine, Dieu ouvre un chemin miraculeux.',
      'Le sang de l\'agneau pascal préfigure le salut accompli par Jésus-Christ.',
      'L\'Éternel combat pour ceux qui gardent silence et se confient en Lui.'
    ],
    questions: [
      'Quelle est la « mer Rouge » à laquelle vous faites face aujourd\'hui ?',
      'Comment apprendre à faire confiance quand tout semble humainement bloqué ?'
    ]
  },
  {
    id: 'david-goliath',
    title: 'David et Goliath',
    category: 'Ancien Testament',
    summary: 'Dans la vallée d\'Éla, le géant philistin Goliath défie l\'armée d\'Israël pendant quarante jours. Le jeune berger David, armé seulement d\'une fronde, de cinq pierres et d\'une foi inébranlable au nom de l\'Éternel, terrasse le champion ennemi.',
    characters: ['David', 'Goliath', 'Saül', 'Éliab'],
    timeline: '~1020 av. J.-C.',
    references: ['1 Samuel 17', 'Psaume 9:10', '2 Corinthiens 10:4'],
    lessons: [
      'La bataille n\'appartient pas aux armes humaines mais à l\'Éternel.',
      'La fidélité dans les petites choses cachées (protéger le troupeau) prépare aux grandes victoires publiques.',
      'L\'indignation sainte devant le déshonneur fait au nom de Dieu donne un courage surnaturel.'
    ],
    questions: [
      'Quels géants de peur ou de découragement vous défient actuellement ?',
      'De quelles « armes de Saül » devez-vous vous défaire pour marcher avec l\'onction de Dieu ?'
    ]
  },
  {
    id: 'daniel-fosse-lions',
    title: 'Daniel dans la fosse aux lions',
    category: 'Ancien Testament',
    summary: 'Sous l\'empire mède de Darius, un décret perfide interdit toute prière à un autre que le roi pendant trente jours. Daniel continue d\'ouvrir sa fenêtre vers Jérusalem et de prier trois fois par jour. Jeté aux lions, Dieu envoie son ange pour fermer la gueule des bêtes féroces.',
    characters: ['Daniel', 'Le roi Darius', 'Les satrapes conspirateurs'],
    timeline: '~538 av. J.-C.',
    references: ['Daniel 6', 'Hébreux 11:33'],
    lessons: [
      'La fidélité envers Dieu prime sur toutes les lois injustes des hommes.',
      'La prière régulière et constante constitue une forteresse inexpugnable.',
      'Dieu protège surnaturellement ses serviteurs intègres au cœur même de l\'épreuve.'
    ],
    questions: [
      'Votre vie de prière est-elle non négociable face aux pressions extérieures ?',
      'Comment témoigner d\'une intégrité exemplaire sur son lieu d\'études ou de travail ?'
    ]
  },
  {
    id: 'fils-prodigue',
    title: 'La Parabole du Père prodigue et de ses deux fils',
    category: 'Paraboles',
    summary: 'Un fils cadet réclame sa part d\'héritage et va dilapider tous ses biens dans une vie de débauche. Réduit à garder des pourceaux et mourant de faim, il rentre chez son père pour demander à être traité comme un ouvrier. Le père, l\'apercevant de loin, court à sa rencontre, l\'embrasse et célèbre une fête joyeuse.',
    characters: ['Le Père aimant', 'Le fils cadet (prodigue)', 'Le fils aîné'],
    timeline: 'Ministère de Jésus',
    references: ['Luc 15:11-32'],
    lessons: [
      'L\'amour du Père céleste est sans limites et attend patiemment le retour de tout pécheur.',
      'Le repentir authentique est accueilli par la réconciliation, sans reproches ni rancœur.',
      'Le légalisme du fils aîné montre qu\'on peut être dans la maison du père tout en restant éloigné de son cœur.'
    ],
    questions: [
      'Vous reconnaissez-vous davantage dans le cadet égaré ou dans l\'aîné amer ?',
      'Quelle révélation de la bonté du Père cette parabole éveille-t-elle en vous ?'
    ]
  },
  {
    id: 'resurrection',
    title: 'La Résurrection de Jésus-Christ',
    category: 'Vie de Jésus',
    summary: 'Au matin du troisième jour après la crucifixion, les femmes découvrent le tombeau vide et la pierre roulée. Deux anges annoncent: « Pourquoi cherchez-vous parmi les morts celui qui est vivant? ». Jésus apparaît ensuite à Marie de Magdala, aux disciples d\'Emmaüs et aux apôtres.',
    characters: ['Jésus-Christ', 'Marie de Magdala', 'Pierre', 'Jean', 'Les apôtres'],
    timeline: '~30/33 ap. J.-C.',
    references: ['Matthieu 28', 'Marc 16', 'Luc 24', 'Jean 20', '1 Corinthiens 15'],
    lessons: [
      'La mort, le péché et l\'enfer ont été définitivement vaincus par Jésus.',
      'La résurrection est le fondement indestructible de la foi chrétienne et de notre espérance future.',
      'La puissance qui a ressuscité Christ d\'entre les morts agit désormais dans les croyants.'
    ],
    questions: [
      'Comment la réalité vivante du Christ ressuscité transforme-t-elle vos craintes ?',
      'Qu\'est-ce qui change quand on sait que notre avenir est garanti pour l\'éternité ?'
    ]
  }
];
