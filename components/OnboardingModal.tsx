
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import MSUIcon from './MSUIcon';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-theme-bg transition-colors duration-500">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-theme-card rounded-[32px] shadow-xl flex items-center justify-center border border-theme-border">
            <MSUIcon size={48} className="text-theme-accent" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-theme-text mb-2 tracking-tight">
            Добро пожаловать
          </h1>
          <p className="text-theme-subtext font-medium">
            Ваш персональный трекер подготовки к экзаменам МГУ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-theme-card p-6 rounded-[24px] shadow-lg border border-theme-border">
          <label className="block text-xs font-bold text-theme-subtext uppercase tracking-widest mb-3 ml-1">
            Как к вам обращаться?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя или никнейм"
            className="w-full bg-theme-input p-4 rounded-xl text-lg font-bold text-theme-text placeholder-theme-subtext/50 focus:outline-none focus:ring-2 focus:ring-theme-accent mb-6 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-theme-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-theme-accent/20"
          >
            Начать подготовку <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
