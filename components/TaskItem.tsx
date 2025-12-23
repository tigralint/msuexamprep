
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  isChecked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  showDate?: boolean;
  border?: boolean;
}

const getSubjectStyle = (subject: string) => {
  switch (subject) {
    case 'МП': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'ГП': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'Логика': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'ЭКЗАМЕН': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-bold';
    case 'Life': return 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20';
    default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return '< 1 мин';
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} ч ${mins} мин`;
  }
  return `${minutes} мин`;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, isChecked, onToggle, onEdit, showDate, border = true }) => {
  const durationString = formatDuration(task.timeSpent);

  return (
    <div 
      className={`
        group flex items-start p-4 bg-theme-card 
        ${border ? 'border-b border-theme-border' : ''}
        transition-all duration-300 active:bg-theme-bg
      `}
    >
      {/* Checkbox Area */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="flex-shrink-0 pt-[2px] mr-3.5 outline-none touch-manipulation"
      >
        <div className={`
          w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
          ${isChecked 
            ? 'bg-theme-accent scale-100 border-transparent' 
            : 'bg-theme-input border-2 border-theme-subtext/30 hover:border-theme-accent/50 scale-100'
          }
        `}>
          <Check 
            size={14} 
            className={`text-white transition-transform duration-300 ${isChecked ? 'scale-100' : 'scale-0'}`} 
            strokeWidth={3} 
          />
        </div>
      </button>

      {/* Content Area */}
      <div 
        onClick={onEdit}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
             <span className={`text-[10px] font-bold px-2 py-[3px] rounded-[6px] uppercase tracking-wide border ${getSubjectStyle(task.subject)}`}>
              {task.subject}
            </span>
            {showDate && (
               <span className="text-xs text-theme-subtext font-medium">
                {formatDate(task.date)}
              </span>
            )}
            {durationString && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-theme-accent bg-theme-accent/10 px-1.5 py-0.5 rounded-full">
                <Clock size={10} />
                {durationString}
              </span>
            )}
          </div>
        </div>
        
        <p className={`
          text-[15px] leading-relaxed transition-all duration-300
          ${isChecked ? 'text-theme-subtext line-through opacity-60' : 'text-theme-text font-medium'}
        `}>
          {task.text}
        </p>
      </div>
    </div>
  );
};

export default TaskItem;
