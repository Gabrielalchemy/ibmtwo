import React from 'react';
import { sendCompanionMessage } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
// SECTION: SidekickAI page
const CompanionPage = () => {
  const { world_bible_summary, companion_history, setCompanionHistory, markModuleComplete } = useStudio();
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [companion_history, sending]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setError(null);
    const nextHistory = [...companion_history, { role: 'user', content: text }];
    setCompanionHistory(nextHistory);
    setMessage('');
    setSending(true);
    try {
      const { data } = await sendCompanionMessage({
        message: text,
        worldBibleSummary: world_bible_summary,
        history: nextHistory,
      });
      setCompanionHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      markModuleComplete('companion');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'SidekickAI is not responding.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-50 mb-1">SidekickAI — Studio Companion</h2>
        <p className="text-sm text-slate-400">Talk through ideas, get unstuck, or brainstorm — SidekickAI knows your world context.</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 rounded-xl border border-studio-border bg-studio-card/40 p-4 mb-3">
        {companion_history.length === 0 && (
          <p className="text-sm text-slate-500 italic">Say hi — SidekickAI is ready when you are.</p>
        )}
        {companion_history.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-studio-primary text-white rounded-br-sm'
                  : 'bg-studio-card border border-studio-border text-slate-200 rounded-bl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-studio-card border border-studio-border px-3.5 py-2 text-xs text-slate-500">
              SidekickAI is typing...
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask SidekickAI anything about your project..."
          className="flex-1 resize-none rounded-full border border-studio-border bg-studio-card/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-studio-primary/70"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="rounded-full bg-studio-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default CompanionPage;
