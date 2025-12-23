import React from 'react';

interface ProgressBarProps {
  total: number;
  completed: number;
  compact?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed, compact = false }) => {
  const percentage = Math.round((completed / total) * 100) || 0;

  if (compact) {
    return (
      <div className="px-4 py-2 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border sticky top-0 z-30 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-theme-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-theme-accent transition-all duration-700 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-theme-subtext w-8 text-right">{percentage}%</span>
        </div>
      </div>
    );
  }

  // Large Widget Style for Home Screen
  return (
    <div className="bg-theme-card rounded-[26px] p-6 shadow-sm border border-theme-border relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-xs font-bold text-theme-subtext uppercase tracking-widest mb-1 opacity-80">Общий прогресс</h2>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-theme-text tracking-tight">{percentage}%</span>
            <span className="text-sm text-theme-subtext font-medium">готово</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full border-[3px] border-theme-border flex items-center justify-center bg-theme-bg/50 backdrop-blur-sm">
             <div className="text-[11px] font-bold text-theme-accent">
                {completed}<span className="text-theme-subtext mx-[1px]">/</span>{total}
             </div>
        </div>
      </div>

      <div className="w-full h-4 bg-theme-border/50 rounded-full overflow-hidden relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-theme-accent to-blue-400 transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      
      {/* Dynamic background glow based on theme */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-theme-accent opacity-[0.1] rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none transition-all duration-500 group-hover:opacity-[0.15]" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-[0.05] rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
    </div>
  );
};

export default ProgressBar;