import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PrincipleCardProps {
  title: string;
  rule: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ title, rule, description, icon: Icon, colorClass }) => {
  return (
    <div className="bg-theme-card rounded-[22px] p-5 shadow-sm border border-theme-border mb-4 last:mb-0 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
      {/* Decorative background blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-[0.08] rounded-full -mr-10 -mt-10 blur-2xl transition-transform duration-700 group-hover:scale-125`} />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:rotate-6`}>
          <Icon className="text-white drop-shadow-md" size={22} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-[17px] font-bold text-theme-text leading-tight mb-1.5 tracking-tight">
            {title}
          </h3>
          <p className="text-[12px] font-bold text-theme-subtext uppercase tracking-wider mb-2 opacity-90">
            {rule}
          </p>
          <p className="text-[15px] leading-relaxed text-theme-text/80 font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrincipleCard;