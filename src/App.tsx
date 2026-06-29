import React, { useState, useEffect } from 'react';
import './index.css';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { QuoteResultComponent } from './components/QuoteResult';
import { AIChat } from './components/AIChat';
import { Footer } from './components/Footer';
import { CalculatorState, QuoteResult } from './types';
import { calculateQuote } from './utils/calculator';
import { initializeTheme, toggleDarkMode } from './utils/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'ai'>('calculator');
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [state, setState] = useState<CalculatorState>({
    numberOfLines: '1',
    customerType: 'portIn',
    deviceType: 'smartphone',
    plan: 'starter',
    homeInternet: false,
    autoPay: false,
    includeTaxes: true,
  });

  useEffect(() => { setIsDarkMode(initializeTheme()); }, []);
  useEffect(() => { setQuote(calculateQuote(state)); }, [state]);

  const handleReset = () => setState({
    numberOfLines: '1', customerType: 'portIn', deviceType: 'smartphone',
    plan: 'starter', homeInternet: false, autoPay: false, includeTaxes: true,
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={(d) => { setIsDarkMode(d); toggleDarkMode(d); }} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['calculator', 'ai'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}>
                {tab === 'calculator' ? 'Price Calculator' : 'AI Assistant'}
              </button>
            ))}
          </div>

          {activeTab === 'calculator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InputSection state={state} onChange={setState} />
                <button onClick={handleReset} className="w-full mt-6 btn-secondary py-3 font-semibold">
                  Reset All
                </button>
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <QuoteResultComponent quote={quote} state={state} />
                </div>
              </div>
            </div>
          ) : (
            <AIChat state={state} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
