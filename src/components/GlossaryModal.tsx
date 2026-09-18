import React, { useState } from 'react';
import {
  Search,
  X,
  BookOpen,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/glossaryData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tooltipsEnabled: boolean;
  onToggleTooltips: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  tooltipsEnabled,
  onToggleTooltips,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = [
    { label: '전체', value: 'ALL' },
    { label: 'Database', value: 'DATABASE' },
    { label: 'Spring/Java', value: 'JAVA' },
    { label: 'Network/API', value: 'API' },
    { label: 'JVM/Infra', value: 'JVM' },
  ];

  const filtered = GLOSSARY_TERMS.filter((term) => {
    if (selectedCategory !== 'ALL' && term.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = term.term.toLowerCase().includes(q);
      const matchFull = term.fullName?.toLowerCase().includes(q);
      const matchShort = term.shortName?.toLowerCase().includes(q);
      const matchSummary = term.summary.toLowerCase().includes(q);
      const matchAliases = term.aliases?.some((a) => a.toLowerCase().includes(q));
      if (!matchName && !matchFull && !matchShort && !matchSummary && !matchAliases) {
        return false;
      }
    }
    return true;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DATABASE':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'JAVA':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'API':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'JVM':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      default:
        return 'text-sky-400 bg-sky-950/60 border-sky-800/60';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0e1622] border border-[#26374d] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#213044] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0078ff]/15 text-[#0078ff] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                실무 핵심 기술 용어 사전
              </h2>
              <p className="text-xs text-slate-400">
                어려운 용어와 약어의 의미를 쉽게 찾아볼 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tooltip on/off toggle */}
            <button
              onClick={onToggleTooltips}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                tooltipsEnabled
                  ? 'border-sky-500/40 bg-sky-950/30 text-sky-300'
                  : 'border-[#253549] bg-[#141f2e] text-slate-400'
              }`}
              title="문제 풀이 중 마우스를 대면 뜨는 툴팁 기능 활성화/비활성화"
            >
              {tooltipsEnabled ? (
                <ToggleRight className="w-4 h-4 text-sky-400" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-500" />
              )}
              <span className="hidden sm:inline">단어 툴팁 {tooltipsEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b2737] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#213044] bg-[#0c131d] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="용어, 약어 검색 (예: OOM, 데드락, 멱등성, TTL, 프록시)..."
              className="w-full bg-[#141f2e] border border-[#253549] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0078ff]"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'bg-[#0078ff] text-white font-semibold'
                    : 'bg-[#141f2e] text-slate-400 hover:text-white hover:bg-[#1a293d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <span className="text-[11px] text-slate-500 ml-auto shrink-0 pl-2">
              {filtered.length}개 용어
            </span>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              검색된 용어가 없습니다.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.term}
                className="p-3.5 rounded-xl border border-[#202f43] bg-[#111a26] space-y-2 hover:border-[#2f425b] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{item.term}</span>
                      {item.shortName && item.shortName !== item.term && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                          {item.shortName}
                        </span>
                      )}
                    </div>
                    {item.fullName && (
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.fullName}
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 border ${getCategoryBadge(
                      item.category
                    )}`}
                  >
                    {item.categoryLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {item.impactTip && (
                  <div className="pt-2 border-t border-[#182535] flex items-start gap-1.5 text-xs text-amber-300/90 leading-tight">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-400">실무 주의:</strong> {item.impactTip}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
