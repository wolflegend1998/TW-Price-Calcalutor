import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { CalculatorState } from '../types';

interface AIChatProps {
  state: CalculatorState;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChat: React.FC<AIChatProps> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I can help you find the best Total Wireless deal. Ask me about plans, promos, or describe what your customer needs." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const history = messages.slice(1);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          number_of_lines: state.numberOfLines,
          device_type: state.deviceType,
          auto_pay: state.autoPay,
          home_internet: state.homeInternet,
          conversation_history: history,
        }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — make sure the API gateway is running.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="card flex flex-col" style={{ height: 520 }}>
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="font-semibold text-gray-900 dark:text-white">AI Deal Assistant</span>
        <span className="text-xs text-gray-500 ml-auto">Context: {state.numberOfLines} line(s) · {state.deviceType}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl text-sm text-gray-500">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about plans, deals, or customer needs..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-primary-500"
        />
        <button onClick={send} disabled={loading}
          className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
