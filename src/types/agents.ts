export type AgentType =
  | 'verse_explanation'
  | 'bible_general'
  | 'search'
  | 'dictionary'
  | 'character'
  | 'story'
  | 'study'
  | 'devotional'
  | 'prayer'
  | 'quiz'
  | 'translation'
  | 'content'
  | 'video_script';

export const CLIENT_AGENT_DESCRIPTIONS: Record<AgentType, { name: string; role: string }> = {
  verse_explanation: {
    name: 'Verse Explanation Agent',
    role: 'Explication exégétique structurée (passage, contexte, enseignement, application, méditation, questions)',
  },
  bible_general: {
    name: 'Bible Agent',
    role: 'Guide sur les livres bibliques, les auteurs, le canon et la chronologie',
  },
  search: {
    name: 'Search Agent',
    role: 'Recherche biblique thématique et références croisées',
  },
  dictionary: {
    name: 'Theological Dictionary Agent',
    role: 'Définitions doctrinales et étymologie biblique vérifiée',
  },
  character: {
    name: 'Character Agent',
    role: 'Biographies bibliques approfondies, leçons de vie et foi',
  },
  story: {
    name: 'Story Agent',
    role: 'Récits des grandes histoires bibliques avec analyse théologique',
  },
  study: {
    name: 'Bible Study Agent',
    role: 'Concepteur d\'études bibliques complètes et structurées',
  },
  devotional: {
    name: 'Devotional Agent',
    role: 'Méditations quotidiennes centrées sur la grâce et la vie chrétienne',
  },
  prayer: {
    name: 'Prayer Agent',
    role: 'Prières scripturaires fondées sur la Parole de Dieu',
  },
  quiz: {
    name: 'Quiz Agent',
    role: 'Générateur de quiz interactifs et questions théologiques',
  },
  translation: {
    name: 'Translation Agent',
    role: 'Comparaison des versions bibliques et nuances théologiques',
  },
  content: {
    name: 'Content Studio Agent',
    role: 'Rédaction d\'articles, publications chrétiennes et résumés',
  },
  video_script: {
    name: 'Video Script Studio Agent',
    role: 'Concepteur de scripts vidéo YouTube/Reels avec découpage visuel',
  },
};

export const AGENT_DESCRIPTIONS = CLIENT_AGENT_DESCRIPTIONS;
