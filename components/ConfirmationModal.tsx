
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-theme-card w-full max-w-xs sm:max-w-sm rounded-[24px] shadow-2xl p-6 relative animate-bounce-in border border-theme-border text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 ring-8 ring-red-500/5">
           <AlertTriangle size={32} strokeWidth={2.5} />
        </div>
        
        <h2 className="text-xl font-black text-theme-text mb-2 tracking-tight">{title}</h2>
        
        <p className="text-theme-subtext text-sm mb-8 leading-relaxed font-medium">
          {description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="p-3.5 rounded-xl bg-theme-bg text-theme-text font-bold hover:bg-theme-border transition-colors active:scale-[0.98]"
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm}
            className="p-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 active:scale-[0.98]"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
