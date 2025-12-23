import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, BookOpen, Type } from 'lucide-react';
import { Task } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: number) => void;
  initialTask: Task | null; // null means creating new
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, onSave, onDelete, initialTask }) => {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initialTask) {
      setText(initialTask.text);
      setSubject(initialTask.subject);
      setDate(initialTask.date);
    } else {
      setText('');
      setSubject('МП');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim() || !date) return;
    
    const taskToSave: Task = {
      id: initialTask ? initialTask.id : Date.now(),
      text,
      subject,
      date
    };
    onSave(taskToSave);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-theme-card w-full max-w-md rounded-t-[24px] sm:rounded-[24px] shadow-2xl p-6 relative animate-slide-up border border-theme-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-theme-text">
            {initialTask ? 'Редактировать задачу' : 'Новая задача'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full bg-theme-bg text-theme-subtext hover:bg-theme-border transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-subtext uppercase tracking-wide flex items-center gap-1">
              <Type size={12} /> Текст задания
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-theme-input p-3 rounded-xl text-theme-text placeholder-theme-subtext focus:outline-none focus:ring-2 focus:ring-theme-accent/50 resize-none h-24 text-sm"
              placeholder="Что нужно выучить?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Subject Input */}
            <div className="space-y-1">
               <label className="text-xs font-bold text-theme-subtext uppercase tracking-wide flex items-center gap-1">
                <BookOpen size={12} /> Предмет
              </label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-theme-input p-3 rounded-xl text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm font-semibold"
                placeholder="МП, ГП..."
              />
            </div>

            {/* Date Input */}
            <div className="space-y-1">
               <label className="text-xs font-bold text-theme-subtext uppercase tracking-wide flex items-center gap-1">
                <Calendar size={12} /> Дата
              </label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-theme-input p-3 rounded-xl text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm font-semibold"
              />
            </div>
          </div>

        </div>

        <div className="mt-8 flex gap-3">
          {initialTask && (
            <button 
              onClick={() => onDelete(initialTask.id)}
              className="p-3.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button 
            onClick={handleSave}
            className="flex-1 bg-theme-accent text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-theme-accent/30"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;