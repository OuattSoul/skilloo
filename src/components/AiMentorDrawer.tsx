import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';
import { X, Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  currentContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Bonjour ! Je suis **Loo**, ton mentor IA pour le parcours Web3 & Blockchain.
Pose-moi tes questions sur Solidity, le hachage, le gas ou la sécurité : je t'aide à comprendre sans te donner directement les réponses des quiz.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim()) return;
    
    sound.playClick();
    const userMsg = inputPrompt;
    setInputPrompt('');

    const newMsgs: ChatMessage[] = [
      ...messages,
      {
        sender: 'user',
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          context: currentContext
        })
      });

      const data = await res.json();
      sound.playSuccess();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || "Désolé, une erreur s'est produite lors du traitement.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      sound.playError();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Je n'ai pas pu joindre le serveur. Assurez-vous d'être connecté ou réessayez.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="false" aria-label="Mentor IA Loo" className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-panel border-l border-line text-ink shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="bg-night p-4 border-b border-line flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/brand/loo-1.png" alt="" className="h-11 w-11 object-contain" />
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <span>Loo · Mentor IA</span>
            </h3>
            <span className="text-[11px] text-ink-muted">Assistance Pédagogique Web3</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="p-2 rounded-lg bg-surface hover:bg-raised text-ink-muted hover:text-ink transition-colors"
          aria-label="Fermer le mentor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm" aria-live="polite">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`p-2 rounded-xl text-xs flex-shrink-0 ${
              msg.sender === 'user' ? 'bg-brand text-brand-navy font-bold' : 'bg-accent/10 text-accent border border-accent/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed space-y-1 ${
              msg.sender === 'user'
                ? 'bg-brand/10 border border-brand/30 text-ink rounded-tr-none'
                : 'bg-night border border-line text-ink rounded-tl-none'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>
              <span className="text-[11px] text-ink-muted block text-right font-mono">{msg.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-ink-muted text-xs italic p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            <span>Loo réfléchit à ta question…</span>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="bg-night p-3 border-t border-line space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Pose ta question à Loo…"
            aria-label="Question pour Loo"
            className="flex-1 bg-night border border-line rounded-xl p-3 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleSendPrompt}
            disabled={isLoading || !inputPrompt.trim()}
            aria-label="Envoyer"
            className="p-3 rounded-xl bg-accent hover:brightness-110 text-ink font-bold transition-all shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
