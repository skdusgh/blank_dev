import React from 'react';
import { RotateCcw, BookOpen, Trophy } from 'lucide-react';
import { AppView, Scenario, PenguinTierInfo } from '../types';

interface TopNavBarProps {
  currentView: AppView;
  activeScenario?: Scenario;
  masteryStats?: {
    total: number;
    reviewedOnce: number;
    mastered: number;
  };
  penguinTier?: PenguinTierInfo;
  onNavigate: (view: AppView) => void;
  onReset?: () => void;
  onOpenGlossary?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  masteryStats,
  penguinTier,
  onNavigate,
  onReset,
  onOpenGlossary,
}) => {
  return (
    <header className="flex justify-between items-center w-full px-4 sm:px-6 h-13 bg-[#111a26] border-b border-[#253346] shrink-0 text-slate-200 select-none z-30">
      {/* Brand & Desktop Navigation */}
      <div className="flex items-center gap-6 sm:gap-8">
        <button
          onClick={() => onNavigate('scenarios')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="font-bold text-base tracking-tight text-white font-mono">
            Blank_Dev
          </span>
        </button>

        {/* Clean GNB */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <button
            onClick={() => onNavigate('scenarios')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentView === 'scenarios'
                ? 'text-white bg-[#1d2b3f] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            문제 목록
          </button>

          <button
            onClick={() => onNavigate('speed-review')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentView === 'speed-review'
                ? 'text-white bg-[#1d2b3f] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            스피드 복습
          </button>

          <button
            onClick={() => onNavigate('active-lab')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentView === 'active-lab'
                ? 'text-white bg-[#1d2b3f] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            디버깅 랩
          </button>

          <button
            onClick={() => onNavigate('ranking')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'ranking'
                ? 'text-white bg-[#1d2b3f] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>랭킹</span>
          </button>
        </nav>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 text-xs">
        {/* Penguin Tier Mini Badge */}
        {penguinTier && (
          <button
            onClick={() => onNavigate('ranking')}
            className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${penguinTier.badgeBg} ${penguinTier.badgeBorder} ${penguinTier.iconColor}`}
            title={`내 펭귄 등급: ${penguinTier.name} (${penguinTier.characterConcept}) - 클릭하여 랭킹 보기`}
          >
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/25 bg-black/40">
              <img
                src={penguinTier.imageUrl}
                alt={penguinTier.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span>{penguinTier.badge}</span>
            <span className="hidden sm:inline">{penguinTier.name}</span>
          </button>
        )}

        {onOpenGlossary && (
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#293d56] bg-[#142132] text-sky-300 hover:text-white hover:bg-[#1c2e46] transition-colors text-xs font-medium"
            title="실무 기술 용어 및 약어 사전 열기"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">용어 사전</span>
          </button>
        )}

        {masteryStats && (
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            해결 <strong className="text-[#00ba7c]">{masteryStats.reviewedOnce}</strong> / {masteryStats.total}
          </span>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-[#172334] rounded transition-colors"
            title="학습 기록 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};


