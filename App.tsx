
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Layers, BookOpen, ChevronLeft, ChevronRight, 
  Home, Shuffle, Zap, Scale, MessageCircle, Moon, Target, Settings, Plus, Timer, Download, Flame
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { INITIAL_SCHEDULE } from './constants';
import { Task, TabOption, ThemeType, BackupData } from './types';
import TaskItem from './components/TaskItem';
import ProgressBar from './components/ProgressBar';
import PrincipleCard from './components/PrincipleCard';
import SettingsModal from './components/SettingsModal';
import EditTaskModal from './components/EditTaskModal';
import OnboardingModal from './components/OnboardingModal';
import ConfirmationModal from './components/ConfirmationModal';
import MSUIcon from './components/MSUIcon';
import PomodoroTimer from './components/PomodoroTimer';
import WordOfTheDay from './components/WordOfTheDay';

const App: React.FC = () => {
  // --- STATE ---

  // 1. Theme State (Default to 'cream')
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('msu_prep_theme');
    return (saved as ThemeType) || 'cream';
  });

  // 2. User Identity
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('msu_prep_username') || '';
  });

  // 3. Date State (Calculate Current Local Date)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // 4. Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.HOME);
  const [streak, setStreak] = useState<number>(0);
  
  // 5. UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- EFFECTS ---

  // Load Data on Mount
  useEffect(() => {
    // Tasks
    const savedTasks = localStorage.getItem('msu_prep_tasks');
    if (savedTasks) {
      try {
        const parsed: Task[] = JSON.parse(savedTasks);
        const migrated = parsed.map(t => ({ ...t, timeSpent: t.timeSpent || 0 }));
        setTasks(migrated);
      } catch (e) { setTasks(INITIAL_SCHEDULE); }
    } else {
      setTasks(INITIAL_SCHEDULE);
    }

    // Progress
    const savedProgress = localStorage.getItem('msu_prep_completed');
    if (savedProgress) {
      try {
        setCompletedIds(new Set(JSON.parse(savedProgress)));
      } catch (e) { console.error(e); }
    }

    // Streak
    const savedStreak = parseInt(localStorage.getItem('msu_prep_streak') || '0');
    const lastStreakDate = localStorage.getItem('msu_prep_last_streak_date');
    
    // Check if streak is broken (more than 1 day missed)
    if (lastStreakDate) {
       const today = new Date();
       const last = new Date(lastStreakDate);
       const diffTime = Math.abs(today.getTime() - last.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       
       const todayStr = today.toISOString().split('T')[0];
       
       // Calculate Yesterday String
       const yest = new Date();
       yest.setDate(yest.getDate() - 1);
       const yestStr = yest.toISOString().split('T')[0];

       if (lastStreakDate === todayStr || lastStreakDate === yestStr) {
         setStreak(savedStreak);
       } else {
         setStreak(0);
         localStorage.setItem('msu_prep_streak', '0');
       }
    } else {
      setStreak(0);
    }

  }, []);

  // Persist Data Changes
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('msu_prep_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('msu_prep_completed', JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  useEffect(() => {
    localStorage.setItem('msu_prep_theme', theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    if (username) localStorage.setItem('msu_prep_username', username);
  }, [username]);
  
  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);


  // --- HANDLERS ---

  // Onboarding
  const handleOnboardingComplete = (name: string) => {
    setUsername(name);
  };

  // Streak Update Logic
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('msu_prep_last_streak_date');
    let currentStreak = streak;

    if (lastDate === today) {
      // Already counted for today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // Start over or new
    }

    setStreak(currentStreak);
    localStorage.setItem('msu_prep_streak', currentStreak.toString());
    localStorage.setItem('msu_prep_last_streak_date', today);
  };

  // Task Actions
  const toggleTask = (id: number) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      const isCompleting = !prev.has(id);
      
      if (isCompleting) {
        next.add(id);
        updateStreak(); // Update streak when completing a task
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditModalOpen(true);
  };

  const saveTask = (task: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...task, timeSpent: t.timeSpent || 0 } : t));
    } else {
      setTasks(prev => [...prev, { ...task, timeSpent: 0 }]);
    }
    setIsEditModalOpen(false);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setIsEditModalOpen(false);
  };

  const updateTaskTime = (taskId: number, secondsToAdd: number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, timeSpent: (t.timeSpent || 0) + secondsToAdd } : t
    ));
  };

  // Calendar Export (.ics)
  const handleExportCalendar = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MSU Prep Tracker//RU\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

    tasks.forEach(task => {
      const dateStr = task.date.replace(/-/g, ''); 
      const cleanText = task.text.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
      const summary = `[${task.subject}] ${cleanText}`;
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${task.id}-${dateStr}@msuprep.app\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
      icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
      icsContent += `SUMMARY:${summary}\n`;
      
      // Alarm 9:00 AM
      icsContent += "BEGIN:VALARM\n";
      icsContent += "ACTION:DISPLAY\n";
      icsContent += "DESCRIPTION:Пора готовиться к экзамену!\n";
      icsContent += "TRIGGER:PT9H\n"; 
      icsContent += "END:VALARM\n";
      
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'MSU_Exam_Plan.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data Management Handlers
  const handleExportData = () => {
    const backup: BackupData = {
      tasks,
      completedIds: Array.from(completedIds),
      theme,
      username,
      timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `msu_prep_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as BackupData;
        if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
        if (data.completedIds && Array.isArray(data.completedIds)) setCompletedIds(new Set(data.completedIds));
        if (data.theme) setTheme(data.theme);
        if (data.username) setUsername(data.username);
        alert('Данные успешно загружены!');
        setIsSettingsOpen(false);
      } catch (err) {
        alert('Ошибка при чтении файла. Убедитесь, что это правильный JSON бэкап.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetRequest = () => {
    setIsResetConfirmOpen(true);
  };

  const executeReset = () => {
    // 1. Clear LocalStorage
    localStorage.clear();
    
    // 2. Reset State in memory (visually helpful before reload)
    setTasks(INITIAL_SCHEDULE);
    setCompletedIds(new Set());
    setTheme('cream');
    setUsername(''); 
    setStreak(0);
    
    // 3. Close modals
    setIsResetConfirmOpen(false);
    setIsSettingsOpen(false);
    
    // 4. Force Reload to restart app in clean state (triggers Onboarding)
    window.location.reload();
  };

  // NEW: Sync To Today Logic
  const handleSyncToToday = () => {
    if (tasks.length === 0) return;

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstTaskDate = new Date(sortedTasks[0].date);
    const today = new Date(selectedDateStr); // Using currently selected date (Today)

    const diffTime = today.getTime() - firstTaskDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      alert("План уже начинается сегодня!");
      return;
    }

    if (window.confirm(`Вы хотите сдвинуть весь план на ${diffDays} дней? Первая задача станет сегодняшней.`)) {
        const newTasks = tasks.map(task => {
          const taskDate = new Date(task.date);
          taskDate.setDate(taskDate.getDate() + diffDays);
          const year = taskDate.getFullYear();
          const month = String(taskDate.getMonth() + 1).padStart(2, '0');
          const day = String(taskDate.getDate()).padStart(2, '0');
          return { ...task, date: `${year}-${month}-${day}` };
        });
        setTasks(newTasks);
        setIsSettingsOpen(false);
    }
  };


  // Drag and Drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const groups: Record<string, Task[]> = {};
    sortedDates.forEach(d => groups[d] = []);
    tasks.forEach(task => {
        if (!groups[task.date]) groups[task.date] = []; 
        groups[task.date].push(task);
    });

    const sourceDate = source.droppableId;
    const destDate = destination.droppableId;
    const sourceList = groups[sourceDate];
    const destList = groups[destDate];

    const [movedTask] = sourceList.splice(source.index, 1);
    if (sourceDate !== destDate) movedTask.date = destDate;
    destList.splice(destination.index, 0, movedTask);

    const newTasks: Task[] = [];
    sortedDates.forEach(date => {
      if (groups[date]) newTasks.push(...groups[date]);
    });

    setTasks(newTasks);
  };

  // Nav Helpers
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
  };

  const changeDate = (days: number) => {
    const current = new Date(selectedDateStr);
    current.setDate(current.getDate() + days);
    
    // Format manually to YYYY-MM-DD to avoid timezone issues
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    setSelectedDateStr(`${year}-${month}-${day}`);
  };

  // Memos
  const todaysTasks = useMemo(() => tasks.filter(t => t.date === selectedDateStr), [tasks, selectedDateStr]);
  const tasksBySubject = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (!groups[task.subject]) groups[task.subject] = [];
      groups[task.subject].push(task);
    });
    return groups;
  }, [tasks]);
  const tasksByDate = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (!groups[task.date]) groups[task.date] = [];
      groups[task.date].push(task);
    });
    return groups;
  }, [tasks]);
  const sortedDates = Object.keys(tasksByDate).sort();

  // --- RENDER ---

  if (!username) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`min-h-screen pb-[env(safe-area-inset-bottom)] font-sans text-theme-text selection:bg-theme-accent/30 transition-colors duration-500`}>
      
      {/* --- HEADER --- */}
      {activeTab === TabOption.HOME ? (
        <header className="px-6 pt-12 pb-6 flex justify-between items-start animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2 opacity-100">
              <div className="flex items-center gap-2 opacity-70">
                <MSUIcon size={20} className="text-theme-accent" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-theme-subtext">MSU Exam Prep</span>
              </div>
              
              {/* Streak Widget */}
              {streak > 0 && (
                <div className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500
                  ${streak >= 3 ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-orange-500/10 text-orange-600'}
                `}>
                  <Flame size={14} fill={streak >= 3 ? "currentColor" : "none"} />
                  {streak} {streak === 1 ? 'день' : (streak < 5 ? 'дня' : 'дней')}
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Удачи, <br/><span className="text-theme-accent">{username}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportCalendar}
              className="p-3 bg-theme-card rounded-full shadow-sm border border-theme-border text-theme-subtext hover:text-theme-accent hover:scale-105 transition-all duration-500"
              title="Экспорт в Календарь"
            >
              <Calendar size={22} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-theme-card rounded-full shadow-sm border border-theme-border text-theme-subtext hover:text-theme-accent hover:rotate-90 transition-all duration-500"
            >
              <Settings size={22} />
            </button>
          </div>
        </header>
      ) : (
        <header className="bg-theme-bg/80 backdrop-blur-xl sticky top-0 z-40 border-b border-theme-border px-4 py-3 flex items-center justify-between shadow-sm transition-all duration-300">
           <h1 className="text-lg font-bold flex items-center gap-2">
             <MSUIcon size={18} className="text-theme-accent" />
             {activeTab === TabOption.TODAY && 'План на сегодня'}
             {activeTab === TabOption.ALL && 'Весь список'}
             {activeTab === TabOption.SUBJECT && 'По предметам'}
             {activeTab === TabOption.TIMER && 'Фокус-таймер'}
           </h1>
           {activeTab !== TabOption.TIMER && (
             <div className="flex items-center gap-3">
               <div className="text-xs font-bold text-theme-subtext bg-theme-card border border-theme-border px-2.5 py-1 rounded-full">
                 {completedIds.size} / {tasks.length}
               </div>
               <button onClick={handleCreateTask} className="text-theme-accent active:scale-90 transition-transform">
                 <Plus size={24} />
               </button>
             </div>
           )}
        </header>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-md mx-auto px-4 pb-24">
        
        {/* TAB: HOME */}
        {activeTab === TabOption.HOME && (
          <div className="space-y-8 animate-slide-up">
            <ProgressBar total={tasks.length} completed={completedIds.size} />

            {/* Word of the Day Widget */}
            <div className="mt-8">
              <WordOfTheDay />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold ml-1 flex items-center gap-2 text-theme-text">
                <Zap size={20} className="text-theme-accent" fill="currentColor" />
                Методика успеха
              </h2>
              
              <div className="stagger-appear">
                <PrincipleCard 
                  title="Интерливинг"
                  rule="Утро: Публичное • Вечер: Частное"
                  description="Мозг устает от монотонности. Смена контекста между МП и ГП усиливает нейронные связи."
                  icon={Shuffle}
                  colorClass="from-blue-500 to-cyan-500"
                />
                <PrincipleCard 
                  title="Активное воспроизведение"
                  rule="Закрой учебник и перескажи"
                  description="Если не можете объяснить тему своими словами за 1 минуту без книги — вы её не выучили."
                  icon={Zap}
                  colorClass="from-amber-400 to-orange-500"
                />
                <PrincipleCard 
                  title="Закон > Доктрина"
                  rule="Первоисточник — истина"
                  description="Мнение профессора важно, но на экзамене нужна и практика. Всегда держите законы открытыми."
                  icon={Scale}
                  colorClass="from-red-500 to-pink-500"
                />
                <PrincipleCard 
                  title="Метод Фейнмана"
                  rule="Объясни первокурснику"
                  description="Сложные термины скрывают непонимание. Используйте простые аналогии."
                  icon={MessageCircle}
                  colorClass="from-green-400 to-emerald-600"
                />
                <PrincipleCard 
                  title="Режим Deep Work"
                  rule="90 мин фокус • 20 мин отдых"
                  description="Уберите телефон в другую комнату во время слотов глубокой работы."
                  icon={Target}
                  colorClass="from-indigo-500 to-purple-600"
                />
                <PrincipleCard 
                  title="Сон — это «Сохранить»"
                  rule="Не учи ночами"
                  description="Память переходит в долговременную только во сне. Лучше выспаться."
                  icon={Moon}
                  colorClass="from-slate-700 to-slate-900"
                />
              </div>
            </div>
            <div className="h-4" />
          </div>
        )}

        {/* TAB: TODAY */}
        {activeTab === TabOption.TODAY && (
          <div className="space-y-4 pt-4 animate-fade-in">
            <ProgressBar total={tasks.length} completed={completedIds.size} compact />

            {/* Date Nav */}
            <div className="bg-theme-card rounded-[22px] p-3 shadow-sm flex items-center justify-between sticky top-[55px] z-20 border border-theme-border">
               <button onClick={() => changeDate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-bg text-theme-accent active:scale-90 transition-transform">
                  <ChevronLeft size={24} />
               </button>
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-theme-subtext uppercase tracking-widest">Выбранная дата</span>
                  <span className="text-lg font-bold capitalize text-theme-text">{formatDisplayDate(selectedDateStr)}</span>
               </div>
               <button onClick={() => changeDate(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-bg text-theme-accent active:scale-90 transition-transform">
                  <ChevronRight size={24} />
               </button>
            </div>

            <div className="bg-theme-card rounded-[24px] shadow-sm overflow-hidden border border-theme-border min-h-[200px]">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task, index) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    isChecked={completedIds.has(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    onEdit={() => handleEditTask(task)}
                    border={index !== todaysTasks.length - 1}
                  />
                ))
              ) : (
                <div className="py-16 px-6 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-theme-bg rounded-full flex items-center justify-center mb-4 animate-bounce-in">
                    <Calendar className="text-theme-subtext opacity-50" size={32} />
                  </div>
                  <h3 className="text-theme-text font-bold mb-1">Задач нет?</h3>
                  <p className="text-theme-subtext text-sm max-w-[200px]">Возможно, сегодня выходной или план закончился. Проверьте вкладку "План".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: ALL TASKS (DRAGGABLE) */}
        {activeTab === TabOption.ALL && (
          <div className="space-y-8 pt-4 animate-fade-in">
             <div className="fixed left-8 top-0 bottom-0 w-[2px] bg-theme-border -z-10 hidden sm:block"></div>

            <DragDropContext onDragEnd={onDragEnd}>
              {sortedDates.map(date => (
                <div key={date} className="relative">
                  <div className="sticky top-[60px] z-20 bg-theme-bg/95 backdrop-blur-md py-2 px-1 mb-2 border-b border-theme-border/50 transition-colors duration-300">
                     <h3 className="text-sm font-bold text-theme-subtext uppercase tracking-wide">
                      {formatDisplayDate(date)}
                    </h3>
                  </div>
                  
                  <Droppable droppableId={date}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-theme-card rounded-[24px] shadow-sm overflow-hidden border border-theme-border min-h-[50px]"
                      >
                        {tasksByDate[date].map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className={snapshot.isDragging ? "z-50 opacity-90 scale-[1.02]" : ""}
                              >
                                <TaskItem 
                                  task={task} 
                                  isChecked={completedIds.has(task.id)}
                                  onToggle={() => toggleTask(task.id)}
                                  onEdit={() => handleEditTask(task)}
                                  border={index !== tasksByDate[date].length - 1}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          </div>
        )}

        {/* TAB: SUBJECTS */}
        {activeTab === TabOption.SUBJECT && (
          <div className="space-y-8 pt-4 animate-fade-in">
            {Object.keys(tasksBySubject).sort().map(subject => {
               const subjectTasks = tasksBySubject[subject];
               const completedCount = subjectTasks.filter(t => completedIds.has(t.id)).length;
               const totalCount = subjectTasks.length;
               const percent = Math.round((completedCount / totalCount) * 100);

               return (
                <div key={subject}>
                  <div className="flex items-end justify-between ml-2 mb-3">
                    <h3 className="text-2xl font-bold text-theme-text tracking-tight">
                      {subject}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-theme-subtext uppercase">Прогресс</span>
                      <span className="text-sm font-bold text-theme-accent">{percent}%</span>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-theme-border rounded-full mb-4 overflow-hidden">
                     <div className="h-full bg-theme-accent transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                  </div>

                  <div className="bg-theme-card rounded-[24px] shadow-sm overflow-hidden border border-theme-border">
                    {subjectTasks.map((task, index) => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        isChecked={completedIds.has(task.id)}
                        onToggle={() => toggleTask(task.id)}
                        onEdit={() => handleEditTask(task)}
                        showDate={true}
                        border={index !== subjectTasks.length - 1}
                      />
                    ))}
                  </div>
                </div>
               )
            })}
          </div>
        )}

        {/* TAB: TIMER */}
        {activeTab === TabOption.TIMER && (
          <PomodoroTimer tasks={tasks} onUpdateTaskTime={updateTaskTime} />
        )}
      </main>

      {/* --- BOTTOM NAV --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-theme-bg/85 backdrop-blur-xl border-t border-theme-border pb-[env(safe-area-inset-bottom)] pt-2 z-50 transition-colors duration-300">
        <div className="flex justify-around items-center max-w-md mx-auto px-1 pb-2">
          {[
            { id: TabOption.HOME, icon: Home, label: 'Главная' },
            { id: TabOption.TODAY, icon: Calendar, label: 'Сегодня' },
            { id: TabOption.TIMER, icon: Timer, label: 'Таймер' },
            { id: TabOption.ALL, icon: Layers, label: 'План' },
            { id: TabOption.SUBJECT, icon: BookOpen, label: 'Предметы' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 w-[18%] relative ${
                activeTab === item.id ? 'text-theme-accent' : 'text-theme-subtext hover:text-theme-text'
              }`}
            >
              {activeTab === item.id && (
                <span className="absolute -top-1 w-8 h-1 bg-theme-accent rounded-full animate-bounce-in" />
              )}
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- MODALS --- */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentTheme={theme} 
        setTheme={setTheme}
        onExport={handleExportData}
        onImport={handleImportData}
        onReset={handleResetRequest}
        onSync={handleSyncToToday}
      />
      
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={executeReset}
        title="Полный сброс"
        description="Вы уверены, что хотите удалить все данные? Это действие безвозвратно удалит ваш прогресс, изменения в плане и имя пользователя. Приложение вернется к исходному состоянию."
      />

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTask={editingTask}
        onSave={saveTask}
        onDelete={deleteTask}
      />

    </div>
  );
};

export default App;
