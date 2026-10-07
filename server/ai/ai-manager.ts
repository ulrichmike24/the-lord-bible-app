import { gemini, DEFAULT_MODEL } from './gemini-client.ts';
import { buildRagContext } from '../rag/rag-engine.ts';

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

export interface AgentResponse {
  agentType: AgentType;
  agentName: string;
  answer: string;
  ragReferences: string[];
}

export const AGENT_DESCRIPTIONS: Record<AgentType, { name: string; role: string }> = {
  verse_explanation: {
    name: 'Verse Explanation Agent',
    role: 'Explication exégétique structurée (passage, contexte, enseignement, application, méditation, questions)'
  },
  bible_general: {
    name: 'Bible Agent',
    role: 'Guide sur les livres bibliques, les auteurs, le canon et la chronologie'
  },
  search: {
    name: 'Search Agent',
    role: 'Recherche biblique thématique et références croisées'
  },
  dictionary: {
    name: 'Theological Dictionary Agent',
    role: 'Définitions doctrinales et étymologie biblique vérifiée'
  },
  character: {
    name: 'Character Agent',
    role: 'Biographies bibliques approfondies, leçons de vie et foi'
  },
  story: {
    name: 'Story Agent',
    role: 'Récits des grandes histoires bibliques avec analyse théologique'
  },
  study: {
    name: 'Bible Study Agent',
    role: 'Concepteur d\'études bibliques complètes et structurées'
  },
  devotional: {
    name: 'Devotional Agent',
    role: 'Méditations quotidiennes centrées sur la grâce et la vie chrétienne'
  },
  prayer: {
    name: 'Prayer Agent',
    role: 'Prières scripturaires fondées sur la Parole de Dieu'
  },
  quiz: {
    name: 'Quiz Agent',
    role: 'Générateur de quiz interactifs et questions théologiques'
  },
  translation: {
    name: 'Translation Agent',
    role: 'Comparaison des versions bibliques et nuances théologiques'
  },
  content: {
    name: 'Content Studio Agent',
    role: 'Rédaction d\'articles, publications chrétiennes et résumés'
  },
  video_script: {
    name: 'Video Script Studio Agent',
    role: 'Concepteur de scripts vidéo YouTube/Reels avec découpage visuel'
  }
};

export function detectAgentType(prompt: string): AgentType {
  const p = prompt.toLowerCase();

  if (p.includes('script video') || p.includes('script vidéo') || p.includes('video script') || p.includes('reels') || p.includes('youtube')) {
    return 'video_script';
  }
  if (p.includes('etude biblique') || p.includes('étude biblique') || p.includes('plan d\'etude') || p.includes('cree une etude') || p.includes('crée une étude')) {
    return 'study';
  }
  if (p.includes('priere') || p.includes('prière') || p.includes('prier pour')) {
    return 'prayer';
  }
  if (p.includes('meditation') || p.includes('méditation') || p.includes('devotion') || p.includes('dévotion')) {
    return 'devotional';
  }
  if (p.includes('quiz') || p.includes('questionnaire') || p.includes('qcm')) {
    return 'quiz';
  }
  if (p.includes('qui est') || p.includes('personnage') || p.includes('vie de ') || p.includes('abraham') || p.includes('moise') || p.includes('david')) {
    return 'character';
  }
  if (p.includes('histoire de') || p.includes('recit de') || p.includes('récit de') || p.includes('parabole')) {
    return 'story';
  }
  if (p.includes('definition') || p.includes('définition') || p.includes('signification') || p.includes('que signifie')) {
    return 'dictionary';
  }
  if (p.includes('traduction') || p.includes('traduire') || p.includes('version')) {
    return 'translation';
  }
  if (p.includes('article') || p.includes('publication') || p.includes('contenu') || p.includes('redige') || p.includes('rédige')) {
    return 'content';
  }
  if (p.includes('explique') || p.includes('verset') || /\b[1-3]?\s*[A-Za-zÀ-ÿ]+\s+\d+:\d+\b/.test(prompt)) {
    return 'verse_explanation';
  }
  if (p.includes('cherche') || p.includes('trouve') || p.includes('quels versets')) {
    return 'search';
  }

  return 'bible_general';
}

const BASE_SYSTEM_PROMPT = `Tu es BIBLE AI, l'assistant spirituel et théologique officiel de la plateforme Bible AI.
Slogan : "La Bible, la connaissance et l'intelligence au même endroit."

PRINCIPES FONDAMENTAUX :
1. RESPECT ET RIGUEUR SACRÉE :
   - Tu fournis des réponses claires, structurées, respectueuses et théologiquement solides.
   - Tu distingues rigoureusement : (1) Le texte biblique exact, (2) Le contexte littéraire et historique, (3) L'interprétation/théologie, (4) L'application pratique personnelle.

2. RÈGLE ABSOLUE SUR LES VERSETS :
   - Ne JAMAIS inventer un verset ni une citation biblique.
   - Si des versets sont fournis dans le [CONTEXTE BIBLIQUE VÉRIFIÉ], utilise prioritairement ces textes officiels.
   - Si une référence n'est pas connue avec certitude absolue, réponds : « Je ne dispose pas de suffisamment d'informations bibliques vérifiées pour confirmer cette information. »

3. POSTURE SPIRITUELLE :
   - Tu es un outil d'aide à la compréhension et à l'édification chrétienne.
   - Tu ne prétends JAMAIS être Dieu, Jésus-Christ, le Saint-Esprit ou une autorité divine infaillible.
   - Lorsque plusieurs interprétations chrétiennes légitimes existent (ex: doctrines évangéliques, réformées, catholiques, orthodoxes), mentionne-les avec bienveillance et équilibre.`;

async function callGeminiWithRetry(promptContent: string, systemInstruction: string) {
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  for (let mIndex = 0; mIndex < modelsToTry.length; mIndex++) {
    const currentModel = modelsToTry[mIndex];

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await gemini.models.generateContent({
          model: currentModel,
          contents: promptContent,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isUnavailable =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429');

        console.warn(`[Bible AI] Model ${currentModel} attempt ${attempt + 1} failed: ${errMsg}`);

        if (isUnavailable) {
          // If unavailable and we have other models to try, switch model quickly
          if (mIndex < modelsToTry.length - 1) {
            break;
          }
          await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
          continue;
        } else {
          break;
        }
      }
    }
  }

  throw new Error('Les modèles Gemini sont temporairement en très forte demande. Veuillez réessayer dans quelques instants.');
}

export async function processBibleAiRequest(
  userPrompt: string,
  forcedAgent?: AgentType,
  translation: 'LSG' | 'KJV' = 'LSG'
): Promise<AgentResponse> {
  const agentType = forcedAgent || detectAgentType(userPrompt);
  const agentMeta = AGENT_DESCRIPTIONS[agentType];

  // Run RAG Retrieval
  const rag = buildRagContext(userPrompt, translation);

  let agentSpecificInstruction = '';

  switch (agentType) {
    case 'verse_explanation':
      agentSpecificInstruction = `Tu agis en tant que Verse Explanation Agent. Structure IMPÉRATIVEMENT ta réponse avec ces sections exactes :
### 📖 Le passage biblique
(Cite le verset mot pour mot d'après la base)
### 💡 Explication générale
### 🔎 Contexte immédiat
### 🏛️ Contexte historique et culturel
### 📚 Références croisées
### 🧠 Enseignement principal
### ❤️ Application pratique
### 🙏 Méditation personnelle
### ❓ Questions de réflexion`;
      break;

    case 'study':
      agentSpecificInstruction = `Tu agis en tant que Study Agent. Structure l'étude biblique complète :
# Titre de l'étude
- Introduction
- Objectifs d'apprentissage
- Passages clés de méditation
- Explication approfondie et points principaux
- Références croisées bibliques
- Questions de groupe ou de réflexion personnelle
- Application concrète dans la vie quotidienne
- Conclusion et Prière de clôture.`;
      break;

    case 'prayer':
      agentSpecificInstruction = `Tu agis en tant que Prayer Agent. Écris une prière fervente, humble et inspirée directement des Écritures. Intègre des versets en louant la fidélité de Dieu. Ne te présente jamais comme un intercesseur divin, mais comme un guide pour aider le croyant à s'adresser au Père céleste au nom de Jésus-Christ.`;
      break;

    case 'video_script':
      agentSpecificInstruction = `Tu agis en tant que Video Script Studio Agent. Crée un script vidéo dynamique (3 à 5 minutes ou format court) :
- Titre accrocheur
- Hook (les 5 premières secondes)
- Introduction
- Scène par scène (avec [Visuel suggéré / Texte à l'écran / Narration voix off])
- Références bibliques affichées
- Conclusion inspirante
- Call to action (Abonnement, méditation, partage)
- Description vidéo optimisée et Hashtags.`;
      break;

    case 'character':
      agentSpecificInstruction = `Tu agis en tant que Character Agent. Présente le personnage :
- Identité et époque
- Rôle dans l'histoire du salut
- Forces spirituelles et moments de foi
- Faiblesses et leçons tirées des épreuves
- Enseignements intemporels pour le croyant d'aujourd'hui.`;
      break;

    case 'quiz':
      agentSpecificInstruction = `Tu agis en tant que Quiz Agent. Propose des questions captivantes avec 4 choix (A, B, C, D), la réponse correcte clairement identifiée, une explication pédagogique détaillée et la référence biblique justificative.`;
      break;

    default:
      agentSpecificInstruction = `Tu agis en tant que ${agentMeta.name}. Rôle : ${agentMeta.role}. Sois pédagogique, précis et profondément édifiant.`;
      break;
  }

  const promptContent = `
${userPrompt}

${rag.formattedContext ? `\n[CONTEXTE BIBLIQUE VÉRIFIÉ DU SYSTÈME RAG] :\n${rag.formattedContext}\n[FIN DU CONTEXTE]` : ''}
`;

  try {
    const answer = await callGeminiWithRetry(
      promptContent,
      `${BASE_SYSTEM_PROMPT}\n\n${agentSpecificInstruction}`
    );

    const refs = rag.explicitVerses.map(v => `${v.bookName} ${v.chapter}:${v.verse}`);

    return {
      agentType,
      agentName: agentMeta.name,
      answer,
      ragReferences: refs
    };
  } catch (error: any) {
    console.error('Gemini Bible AI Error:', error);

    // If API error happens, construct emergency RAG fallback answer with verified scriptures
    let fallbackText = `Le service d'inférence connaît un pic temporaire d'affluence. Voici toutefois les données scripturaires et théologiques vérifiées de notre base :\n\n`;

    if (rag.explicitVerses.length > 0) {
      fallbackText += `📖 **Passage biblique de référence (${translation})** :\n`;
      rag.explicitVerses.forEach(v => {
        fallbackText += `> « ${v.text} » — *${v.bookName} ${v.chapter}:${v.verse}*\n\n`;
      });
    }

    if (rag.dictionaryEntries.length > 0) {
      fallbackText += `💡 **Définition théologique** :\n`;
      rag.dictionaryEntries.forEach(d => {
        fallbackText += `**${d.term}** : ${d.definition}\n*Signification biblique* : ${d.biblicalSignificance}\n\n`;
      });
    }

    if (rag.characterProfiles.length > 0) {
      fallbackText += `👤 **Profil du personnage** :\n`;
      rag.characterProfiles.forEach(c => {
        fallbackText += `**${c.name}** (${c.era}) : ${c.presentation}\n*Leçons spirituelles* : ${c.teachings.join(' ; ')}\n\n`;
      });
    }

    fallbackText += `\n*Veuillez relancer votre question dans un instant pour obtenir l'exégèse complète générée par l'IA.*`;

    return {
      agentType,
      agentName: agentMeta.name,
      answer: fallbackText,
      ragReferences: rag.explicitVerses.map(v => `${v.bookName} ${v.chapter}:${v.verse}`)
    };
  }
}
