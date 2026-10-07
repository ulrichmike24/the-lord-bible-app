import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { api, AiChatResponse } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  agentType?: string;
  agentName?: string;
  ragReferences?: string[];
  timestamp: string;
}

interface BibleAiChatProps {
  translation: 'LSG' | 'KJV';
  initialPrompt?: string;
}

export const BibleAiChat: React.FC<BibleAiChatProps> = ({ translation, initialPrompt }) => {
  const { isWhite } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Bonjour ! Je suis Bible AI, votre assistant théologique propulsé par Gemini et notre base de données scripturaire vérifiée.

Posez-moi une question sur un passage, un personnage, un concept doctrinal, ou demandez-moi de concevoir une étude biblique ou une prière.

Exemples :
• « Explique Jean 3:16 et son contexte »
• « Qui est Abraham et quelle leçon de foi tirer de sa vie ? »
• « Quelle est la différence biblique entre grâce et miséricorde ? »
• « Crée une étude biblique sur le Saint-Esprit pour débutant »
• « Donne-moi une prière basée sur le Psaume 23 »`,
      agentName: 'Bible AI Manager',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>(initialPrompt || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('auto');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const promptSuggestions = [
    'Explique Jean 3:16',
    'Qui est Abraham ?',
    'Quels versets parlent de la foi ?',
    'Différence entre grâce et miséricorde',
    'Étude sur le Saint-Esprit',
    'Prière basée sur Psaume 23',
    'Explique Romains 8:28',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response: AiChatResponse = await api.chatWithAi(
        query,
        selectedAgent === 'auto' ? undefined : selectedAgent,
        translation
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        agentType: response.agentType,
        agentName: response.agentName,
        ragReferences: response.ragReferences,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Une erreur est survenue lors de la communication avec l'assistant Bible AI. Veuillez réessayer dans quelques instants.`,
        agentName: 'Erreur',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto border rounded-3xl overflow-hidden shadow-sm transition-colors ${
      isWhite
        ? 'bg-white border-neutral-200 text-neutral-900'
        : 'bg-neutral-950/80 border-neutral-800 text-neutral-100'
    }`}>
      {/* CHAT HEADER */}
      <div className={`p-4 border-b flex items-center justify-between gap-3 ${
        isWhite ? 'bg-neutral-50/90 border-neutral-200' : 'bg-neutral-900/90 border-neutral-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs ${
            isWhite ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-black text-sm ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                Bible AI Assistant
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isWhite
                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-800 text-neutral-200 border-neutral-700'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                RAG Actif
              </span>
            </div>
            <p className={`text-[11px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Gemini & RAG biblique • {translation === 'LSG' ? 'Louis Segond 1910' : 'King James Version'}
            </p>
          </div>
        </div>

        {/* Agent switcher & Clear */}
        <div className="flex items-center gap-2">
          <select
            value={selectedAgent}
            onChange={e => setSelectedAgent(e.target.value)}
            className={`border text-xs rounded-xl px-2.5 py-1.5 outline-none transition-colors ${
              isWhite
                ? 'bg-white border-neutral-300 text-neutral-800 focus:border-neutral-950'
                : 'bg-neutral-900 border-neutral-800 text-neutral-200 focus:border-white'
            }`}
          >
            <option value="auto">Routage automatique (13 Agents)</option>
            <option value="verse_explanation">Verse Explanation Agent</option>
            <option value="study">Bible Study Agent</option>
            <option value="prayer">Prayer Agent</option>
            <option value="dictionary">Theological Dictionary Agent</option>
            <option value="character">Character Agent</option>
            <option value="story">Story Agent</option>
            <option value="video_script">Video Script Studio Agent</option>
            <option value="quiz">Quiz Agent</option>
            <option value="devotional">Devotional Agent</option>
          </select>

          <button
            onClick={handleClear}
            className={`p-1.5 rounded-xl border transition-all ${
              isWhite
                ? 'bg-white hover:bg-neutral-100 text-neutral-600 hover:text-black border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800'
            }`}
            title="Effacer la conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? isWhite
                    ? 'bg-neutral-950 text-white'
                    : 'bg-white text-neutral-950'
                  : isWhite
                  ? 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                  : 'bg-neutral-900 text-white border border-neutral-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                msg.sender === 'user'
                  ? isWhite
                    ? 'bg-neutral-950 text-white rounded-tr-none font-medium'
                    : 'bg-white text-neutral-950 rounded-tr-none font-medium'
                  : isWhite
                  ? 'bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-tl-none font-sans'
                  : 'bg-neutral-900 text-neutral-100 border border-neutral-800 rounded-tl-none font-sans'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className={`flex items-center justify-between pb-2 border-b text-[11px] font-bold ${
                  isWhite ? 'border-neutral-200 text-neutral-900' : 'border-neutral-800 text-neutral-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{msg.agentName || 'Bible AI'}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className={`flex items-center gap-1 text-[10px] font-normal ${
                      isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Copier la réponse"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
              )}

              {/* Verified RAG Citations */}
              {msg.ragReferences && msg.ragReferences.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.ragReferences.map(ref => (
                    <span
                      key={ref}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${
                        isWhite
                          ? 'bg-white border-neutral-300 text-neutral-800'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-200'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      {ref}
                    </span>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-line font-sans">{msg.text}</div>

              <div className={`text-[10px] text-right select-none pt-1 ${
                msg.sender === 'user'
                  ? isWhite ? 'text-neutral-400' : 'text-neutral-600'
                  : isWhite ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isWhite ? 'bg-neutral-100 text-neutral-900 border border-neutral-300' : 'bg-neutral-900 text-white border border-neutral-800'
            }`}>
              <Bot className="w-4 h-4" />
            </div>
            <div className={`border rounded-3xl rounded-tl-none p-4 text-xs flex items-center gap-2.5 ${
              isWhite
                ? 'bg-neutral-50 border-neutral-200 text-neutral-700'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}>
              <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                isWhite ? 'border-neutral-900' : 'border-white'
              }`} />
              <span>Bible AI consulte les Écritures et prépare sa réponse...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* PROMPT SUGGESTIONS BAR */}
      <div className={`px-4 py-2 border-t overflow-x-auto whitespace-nowrap custom-scrollbar flex items-center gap-2 ${
        isWhite ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
      }`}>
        <Lightbulb className={`w-3.5 h-3.5 shrink-0 ml-1 ${isWhite ? 'text-neutral-800' : 'text-neutral-300'}`} />
        <span className={`text-[10px] uppercase font-bold shrink-0 ${
          isWhite ? 'text-neutral-500' : 'text-neutral-400'
        }`}>
          Suggestions :
        </span>
        {promptSuggestions.map(sug => (
          <button
            key={sug}
            onClick={() => handleSend(sug)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition-colors ${
              isWhite
                ? 'bg-white hover:bg-neutral-100 text-neutral-800 hover:text-black border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
            }`}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className={`p-3 border-t ${
        isWhite ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez votre question biblique (ex: Explique Romains 8:28, qui était Moïse...)"
            disabled={loading}
            className={`flex-1 border rounded-2xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors ${
              isWhite
                ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
            }`}
          >
          </input>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-2xl font-bold shadow-md active:scale-95 transition-all disabled:opacity-40 ${
              isWhite
                ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                : 'bg-white hover:bg-neutral-200 text-neutral-950'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
