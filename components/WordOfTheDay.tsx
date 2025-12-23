
import React, { useState, useEffect } from 'react';
import { RefreshCw, BookMarked } from 'lucide-react';
import { LEGAL_TERMS } from '../constants';

const WordOfTheDay: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [displayedDefinition, setDisplayedDefinition] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Initial random term
    setIndex(Math.floor(Math.random() * LEGAL_TERMS.length));
  }, []);

  const currentTerm = LEGAL_TERMS[index];

  useEffect(() => {
    if (!currentTerm) return;

    setDisplayedDefinition('');
    setIsTyping(true);
    let i = 0;
    const text = currentTerm.definition;
    
    // Typing animation loop
    const timer = setInterval(() => {
      setDisplayedDefinition(text.substring(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 25); // Speed of typing: 25ms per character

    return () => clearInterval(timer);
  }, [index, currentTerm]);

  const handleRefresh = () => {
    let newIndex = Math.floor(Math.random() * LEGAL_TERMS.length);
    // Ensure we get a new term if possible
    while (newIndex === index && LEGAL_TERMS.length > 1) {
      newIndex = Math.floor(Math.random() * LEGAL_TERMS.length);
    }
    setIndex(newIndex);
  };

  return (
    <div className="bg-theme-card rounded-[26px] p-6 shadow-sm border border-theme-border relative overflow-hidden group mb-4">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <BookMarked size={120} />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h2 className="text-xs font-bold text-theme-subtext uppercase tracking-widest flex items-center gap-2">
          <BookMarked size={14} className="text-theme-accent" />
          Слово дня
        </h2>
        <button 
          onClick={handleRefresh}
          className="p-2 -mr-2 -mt-2 rounded-full text-theme-subtext hover:text-theme-accent hover:bg-theme-bg/50 transition-all active:rotate-180"
          title="Новое слово"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div>
        <p className="font-serif italic text-2xl sm:text-3xl text-theme-text mb-3 leading-tight tracking-tight animate-fade-in">
          {currentTerm?.term}
        </p>
        <p className="text-sm sm:text-[15px] font-medium text-theme-subtext/90 leading-relaxed border-l-2 border-theme-accent/30 pl-3 min-h-[48px]">
          {displayedDefinition}
          {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-theme-accent animate-cursor align-middle" />}
        </p>
      </div>
    </div>
  );
};

export default WordOfTheDay;
