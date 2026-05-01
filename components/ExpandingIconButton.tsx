import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDarkMode?: boolean;
  className?: string;
  side?: 'left' | 'right';
  active?: boolean;
  activeClassName?: string;
  layoutId?: string;
}

export const ExpandingIconButton: React.FC<Props> = ({ 
  icon, 
  label, 
  onClick, 
  isDarkMode = false, 
  className = "", 
  side = 'left',
  active = false,
  activeClassName = "",
  layoutId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      if (!isExpanded) {
        setIsExpanded(true);
        // Consequently proceed after animation
        setTimeout(() => {
          onClick();
          // Reset after a delay so it doesn't stay expanded forever on mobile if navigated back
          setTimeout(() => setIsExpanded(false), 2000);
        }, 600);
      } else {
        onClick();
      }
    } else {
      onClick();
    }
  };

  const showLabel = isMobile ? isExpanded : isHovered;

  return (
    <motion.button
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={handleClick}
      layout
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`
        flex items-center h-12 md:h-14 rounded-full border shadow-lg backdrop-blur-xl pointer-events-auto overflow-hidden
        ${showLabel ? 'w-auto px-5' : 'w-12 md:w-14 px-0'}
        ${active ? activeClassName : (isDarkMode ? 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:bg-slate-800' : 'bg-white/80 border-slate-200 text-slate-500 hover:bg-slate-100')}
        ${className}
      `}
    >
      <div className={`flex items-center h-full ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-12 md:w-14 h-12 md:h-14 flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        
        <AnimatePresence initial={false}>
          {showLabel && (
            <motion.span
              initial={{ width: 0, opacity: 0, marginLeft: 0, marginRight: 0 }}
              animate={{ 
                width: 'auto', 
                opacity: 1, 
                marginLeft: side === 'left' ? 0 : 8,
                marginRight: side === 'left' ? 8 : 0 
              }}
              exit={{ width: 0, opacity: 0, marginLeft: 0, marginRight: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] leading-none"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};
