import React, { useState } from 'react';
import { X, PenLine, Tag, Image, Send, Loader2, Sparkles } from 'lucide-react';
import { UpdateCategory, ImpactUpdate } from '../types';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (update: ImpactUpdate) => void;
  isDarkMode?: boolean;
}

const categories: { value: UpdateCategory; label: string; color: string }[] = [
  { value: 'field-work', label: 'Field Work', color: 'bg-emerald-500' },
  { value: 'community', label: 'Community', color: 'bg-violet-500' },
  { value: 'milestone', label: 'Milestone', color: 'bg-amber-500' }
];

export const PostUpdateModal: React.FC<Props> = ({ isVisible, onClose, onSubmit, isDarkMode = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<UpdateCategory>('field-work');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUpdate: ImpactUpdate = {
      id: `update-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(newUpdate);
    setIsSubmitting(false);
    setTitle('');
    setContent('');
    setCategory('field-work');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div 
        className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/40' : 'bg-slate-200/40'}`}
        onClick={onClose}
      />

      <div className={`relative w-full max-w-lg backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className={`h-32 relative overflow-hidden border-b ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/80 to-teal-950/80 border-emerald-900/50' : 'bg-gradient-to-br from-emerald-400/80 to-teal-500/80 border-emerald-200'}`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors backdrop-blur-md ${isDarkMode ? 'bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white' : 'bg-white/20 hover:bg-white/40 text-slate-700 hover:text-slate-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 pt-6 relative">
          <div className={`absolute -top-10 left-8 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center border ${isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <Sparkles size={40} className="text-emerald-400" />
          </div>

          <div className="mt-12">
            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <PenLine size={12} />
              Post Impact Update
            </div>
            <h2 className={`font-serif text-3xl mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Share your progress</h2>

            <div className="space-y-5">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., First 1000 trees planted!"
                  className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Category
                </label>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        category === cat.value
                          ? `${cat.color} text-white shadow-lg`
                          : `${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'} border`
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Update Details
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell the community about your progress..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all outline-none resize-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className={`w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-all active:scale-[0.98] shadow-lg hover:shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Transmitting to Archipelago...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Publish to World
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};