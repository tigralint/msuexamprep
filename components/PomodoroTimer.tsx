
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface PomodoroTimerProps {
  tasks: Task[];
  onUpdateTaskTime: (taskId: number, seconds: number) => void;
}

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ tasks, onUpdateTaskTime }) => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Filter for today's tasks or incomplete tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const activeTasks = tasks.filter(t => t.date === todayStr); // Show today's tasks primarily
  
  // Initialize selected task
  useEffect(() => {
    if (selectedTaskId === null && activeTasks.length > 0) {
      setSelectedTaskId(activeTasks[0].id);
    }
  }, [activeTasks, selectedTaskId]);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // If in focus mode and a task is selected, accrue time to that task
        if (mode === 'focus' && selectedTaskId) {
          onUpdateTaskTime(selectedTaskId, 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch modes could go here, for now just stop
      if (mode === 'focus') {
         setMode('break');
         setTimeLeft(BREAK_TIME);
      } else {
         setMode('focus');
         setTimeLeft(FOCUS_TIME);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, selectedTaskId, onUpdateTaskTime]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = () => {
    setIsActive(false);
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular Progress Logic
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const progress = timeLeft / totalTime;
  const dashOffset = circumference - (1 - progress) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full animate-fade-in pb-20">
      
      {/* Mode Switcher */}
      <div className="flex bg-theme-card p-1 rounded-full border border-theme-border mb-8 shadow-sm">
        <button
          onClick={() => { if(mode !== 'focus') switchMode(); }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            mode === 'focus' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-subtext hover:text-theme-text'
          }`}
        >
          <Brain size={16} /> Работа
        </button>
        <button
          onClick={() => { if(mode !== 'break') switchMode(); }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            mode === 'break' ? 'bg-green-500 text-white shadow-md' : 'text-theme-subtext hover:text-theme-text'
          }`}
        >
          <Coffee size={16} /> Отдых
        </button>
      </div>

      {/* Timer Circle */}
      <div className="relative mb-8">
        {/* Glow Effect */}
        <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full ${mode === 'focus' ? 'bg-theme-accent' : 'bg-green-500'}`}></div>
        
        <svg width="300" height="300" className="transform -rotate-90 relative z-10">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-theme-border"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-theme-accent' : 'text-green-500'}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-6xl font-black font-mono tracking-tighter text-theme-text tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-theme-subtext font-medium mt-2 uppercase tracking-widest text-xs">
            {isActive ? (mode === 'focus' ? 'Фокус' : 'Релакс') : 'Пауза'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-10">
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-theme-card border border-theme-border text-theme-subtext hover:text-theme-text active:scale-95 transition-all"
        >
          <RotateCcw size={24} />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all ${
            mode === 'focus' ? 'bg-theme-accent shadow-theme-accent/30' : 'bg-green-500 shadow-green-500/30'
          }`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {/* Task Selector */}
      <div className="w-full px-1">
        <h3 className="text-xs font-bold text-theme-subtext uppercase tracking-wide mb-3 pl-2">
          {mode === 'focus' ? 'К какой задаче привязать время?' : 'Отдыхайте, задачи подождут'}
        </h3>
        
        {mode === 'focus' && (
           <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar px-1 snap-x">
             {activeTasks.length > 0 ? (
               activeTasks.map(task => (
                 <button
                   key={task.id}
                   onClick={() => setSelectedTaskId(task.id)}
                   className={`
                     flex-shrink-0 w-64 p-4 rounded-2xl border text-left transition-all duration-300 snap-center
                     ${selectedTaskId === task.id 
                       ? 'border-theme-accent bg-theme-accent/5 ring-1 ring-theme-accent' 
                       : 'border-theme-border bg-theme-card opacity-60 hover:opacity-100'
                     }
                   `}
                 >
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-theme-bg border border-theme-border uppercase">
                        {task.subject}
                      </span>
                      {selectedTaskId === task.id && <CheckCircle2 size={16} className="text-theme-accent" />}
                   </div>
                   <p className="text-sm font-medium text-theme-text line-clamp-2 leading-snug">
                     {task.text}
                   </p>
                   {task.timeSpent && task.timeSpent > 0 ? (
                      <p className="mt-2 text-xs text-theme-subtext font-mono">
                        Накоплено: {Math.floor(task.timeSpent / 60)} мин
                      </p>
                   ) : null}
                 </button>
               ))
             ) : (
               <div className="w-full p-4 text-center text-theme-subtext text-sm bg-theme-card rounded-2xl border border-theme-border border-dashed">
                 На сегодня задач нет. Добавьте их во вкладке "Сегодня".
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
