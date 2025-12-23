
import React, { useRef } from 'react';
import { X, Moon, Sun, Coffee, Cloud, Download, Upload, Trash2, Database, RefreshCw } from 'lucide-react';
import { ThemeType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  setTheme: (t: ThemeType) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onSync: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, currentTheme, setTheme, onExport, onImport, onReset, onSync
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const themes: { id: ThemeType; name: string; icon: any; color: string }[] = [
    { id: 'cream', name: 'Бумага', icon: Coffee, color: 'bg-[#F5F5DC]' },
    { id: 'light', name: 'Светлая', icon: Sun, color: 'bg-[#F2F2F7]' },
    { id: 'dark', name: 'Тёмная', icon: Moon, color: 'bg-[#000000]' },
    { id: 'midnight', name: 'Ночь', icon: Cloud, color: 'bg-[#0f172a]' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-theme-card w-full max-w-sm rounded-[24px] shadow-2xl p-6 relative animate-bounce-in border border-theme-border max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-theme-text">Настройки</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-theme-bg text-theme-subtext hover:bg-theme-border transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Theme Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-theme-subtext uppercase tracking-wide mb-4">Тема оформления</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-theme-accent bg-theme-accent/5' 
                      : 'border-transparent bg-theme-bg hover:bg-theme-border'
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'text-theme-accent' : 'text-theme-subtext'}`}>
                    <Icon size={18} fill={isSelected ? "currentColor" : "none"} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-theme-text' : 'text-theme-subtext'}`}>
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-theme-subtext uppercase tracking-wide mb-4 flex items-center gap-2">
            <Database size={14} /> Управление данными
          </h3>
          
          <div className="space-y-3">
             <button 
              onClick={onSync}
              className="w-full flex items-center justify-between p-4 bg-theme-bg rounded-xl border border-theme-border text-theme-text hover:bg-theme-border/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                  <RefreshCw size={18} />
                </div>
                <div className="flex flex-col items-start">
                   <span className="font-medium text-sm">Начать план с сегодня</span>
                   <span className="text-[10px] text-theme-subtext">Сдвигает все даты</span>
                </div>
              </div>
            </button>

            <button 
              onClick={onExport}
              className="w-full flex items-center justify-between p-4 bg-theme-bg rounded-xl border border-theme-border text-theme-text hover:bg-theme-border/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Download size={18} />
                </div>
                <span className="font-medium text-sm">Скачать бэкап</span>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 bg-theme-bg rounded-xl border border-theme-border text-theme-text hover:bg-theme-border/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                  <Upload size={18} />
                </div>
                <span className="font-medium text-sm">Загрузить бэкап</span>
              </div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={onImport}
            />

            <button 
              onClick={onReset}
              className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors mt-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                  <Trash2 size={18} />
                </div>
                <span className="font-medium text-sm">Полный сброс</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-theme-subtext">MSU Exam Prep v2.1</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
