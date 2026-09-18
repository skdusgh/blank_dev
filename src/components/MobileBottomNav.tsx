import React from 'react';
import { LayoutList, Zap, Terminal, CheckSquare, BookOpen, Trophy } from 'lucide-react';
import { AppView } from '../types';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenGlossary?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenGlossary,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="모바일 하단 내비게이션"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111a26]/95 backdrop-blur-md border-t border-[#253346] px-1 py-1 flex items-center justify-around select-none pb-safe"
    >
      <button
        onClick={() => onNavigate('scenarios')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'scenarios'
            ? 'text-[#0078ff] font-semibold'
            : 'text-slate-400'
        }`}
      >
        <LayoutList className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">문제</span>
      </button>

      <button
        onClick={() => onNavigate('active-lab')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'active-lab'
            ? 'text-[#0078ff] font-semibold'
            : 'text-slate-400'
        }`}
      >
        <Terminal className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">랩실</span>
      </button>

      <button
        onClick={() => onNavigate('speed-review')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'speed-review'
            ? 'text-[#0078ff] font-semibold'
            : 'text-slate-400'
        }`}
      >
        <Zap className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">스피드</span>
      </button>

      <button
        onClick={() => onNavigate('ranking')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'ranking'
            ? 'text-amber-400 font-semibold'
            : 'text-slate-400'
        }`}
      >
        <Trophy className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">랭킹</span>
      </button>

      <button
        onClick={() => onNavigate('pir')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'pir'
            ? 'text-[#0078ff] font-semibold'
            : 'text-slate-400'
        }`}
      >
        <CheckSquare className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">리포트</span>
      </button>

      {onOpenGlossary && (
        <button
          onClick={onOpenGlossary}
          className="flex-1 flex flex-col items-center justify-center py-1.5 transition-colors text-sky-400 hover:text-sky-300"
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">사전</span>
        </button>
      )}
    </nav>
  );
};
