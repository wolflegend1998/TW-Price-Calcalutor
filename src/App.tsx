import React, { useState, useEffect } from 'react';
import './index.css';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { QuoteResultComponent } from './components/QuoteResult';
import { Footer } from './components/Footer';
import { CalculatorState, QuoteResult } from './types';
import { calculateQuote } from './utils/calculator';
import { initializeTheme, toggleDarkMode } from './utils/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [state, setState] = useState<CalculatorState>({
    numberOfLines: '1',
    customerType: 'portIn',
    deviceType: 'smartphone',
    plan: 'unlimited',
    homeInternet: false,
    autoPay: false,
    includeTaxes: true,
  });

  // Initialize theme on mount
  useEffect(() => {
    const isDark = initializeTheme();
    setIsDarkMode(isDark);
  }, []);

  // Calculate quote whenever state changes
  useEffect(() => {
    const newQuote = calculateQuote(state);
    setQuote(newQuote);
  }, [state]);

  const handleToggleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    toggleDarkMode(isDark);
  };

  const handleReset = () => {
    setState({
      numberOfLines: '1',
      customerType: 'portIn',
      deviceType: 'smartphone',
      plan: 'unlimited',
      homeInternet: false,
      autoPay: false,
      includeTaxes: true,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <InputSection state={state} onChange={setState} />
              <button
                onClick={handleReset}
                className="w-full mt-6 btn-secondary py-3 font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Quote Result */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <QuoteResultComponent quote={quote} state={state} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
