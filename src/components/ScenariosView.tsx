import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Trophy,
} from 'lucide-react';
import { Scenario } from '../types';
import { getPenguinTier, getNextTierProgress } from '../utils/rankingStorage';

interface ScenariosViewProps {
  scenarios: Scenario[];
  onStartScenario: (scenario: Scenario) => void;
  onReviewScenario: (scenario: Scenario) => void;
  onGoToSpeedReview?: () => void;
  onGoToRanking?: () => void;
  onToggleBookmark?: (scenarioId: string) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  scenarios,
  onStartScenario,
  onReviewScenario,
  onGoToRanking,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const solvedCount = useMemo(() => {
    return scenarios.filter((s) => (s.reviewCount || 0) >= 1 || s.solved).length;
  }, [scenarios]);

  const currentTier = useMemo(() => getPenguinTier(solvedCount), [solvedCount]);
  const progressInfo = useMemo(() => getNextTierProgress(solvedCount), [solvedCount]);

  const countFor = (cat: string) => {
    if (cat === 'ALL') return scenarios.length;
    return scenarios.filter((s) => s.category === cat).length;
  };

  const categories = [
    { label: '전체', value: 'ALL', count: countFor('ALL') },
    { label: 'Database', value: 'DATABASE', count: countFor('DATABASE') },
    { label: 'Spring', value: 'JAVA', count: countFor('JAVA') },
    { label: 'Network/API', value: 'API', count: countFor('API') },
    { label: 'JVM', value: 'JVM', count: countFor('JVM') },
  ];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleLevelChange = (lvl: 'ALL' | 1 | 2 | 3 | 4) => {
    setLevelFilter(lvl);
    setCurrentPage(1);
  };

  const handleSearchChange = (kw: string) => {
    setSearchKeyword(kw);
    setCurrentPage(1);
  };

  const filteredScenarios = scenarios.filter((s) => {
    const categoryMatch = selectedCategory === 'ALL' || s.category === selectedCategory;
    if (!categoryMatch) return false;

    if (levelFilter !== 'ALL' && s.difficultyStars !== levelFilter) return false;

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredScenarios.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedScenarios = filteredScenarios.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const getLevelBadge = (stars: number) => {
    switch (stars) {
      case 1:
        return { label: 'Lv.1', style: 'text-[#00ba7c] bg-[#00ba7c]/10' };
      case 2:
        return { label: 'Lv.2', style: 'text-[#3b82f6] bg-[#0078ff]/10' };
      case 3:
        return { label: 'Lv.3', style: 'text-[#f59e0b] bg-[#f59e0b]/10' };
      case 4:
      default:
        return { label: 'Lv.4', style: 'text-[#a855f7] bg-[#8b5cf6]/10' };
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full space-y-5 pb-24 md:pb-8">
      {/* Penguin Tier Status Banner */}
      {onGoToRanking && (
        <div
          onClick={onGoToRanking}
          className="cursor-pointer bg-[#142132] hover:bg-[#18283c] border border-[#25374e] hover:border-[#354e6e] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border relative bg-gradient-to-b from-[#0e1724] to-[#070d15] p-0.5 ${currentTier.badgeBorder}`}>
              <img
                src={currentTier.imageUrl}
                alt={currentTier.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-0 right-0 text-[10px] bg-black/75 rounded-tl px-1 leading-tight">
                {currentTier.badge}
              </span>
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-bold text-xs ${currentTier.iconColor}`}>
                  {currentTier.badge} {currentTier.name}
                </span>
                <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                  ({currentTier.characterConcept})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  누적 해결 <strong className="text-white">{solvedCount}</strong> / {scenarios.length}문제
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {progressInfo.nextTier ? (
                  <>
                    다음 <strong className="text-slate-300">{progressInfo.nextTier.name}</strong>까지 {progressInfo.neededForNext}문제 남음 ({progressInfo.progressPercent}%)
                  </>
                ) : (
                  '최고 등급 퍼스트펭귄 달성!'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sky-400 group-hover:text-sky-300 text-xs font-medium shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">펭귄 랭킹 보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Clean Header & Filters */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-[#253346] pb-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-[#203046] text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
              }`}
            >
              {cat.label} <span className="text-slate-500 text-[11px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Level and Search in One Clean Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium mr-1">난이도:</span>
            {(['ALL', 1, 2, 3, 4] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  levelFilter === lvl
                    ? 'bg-[#0078ff] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#172334]'
                }`}
              >
                {lvl === 'ALL' ? '전체' : `Lv.${lvl}`}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="문제 검색..."
              className="w-full bg-[#111a26] border border-[#253346] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#0078ff]"
            />
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div className="space-y-2">
        {filteredScenarios.length === 0 ? (
          <div className="text-center py-12 border border-[#253346] rounded-xl bg-[#111a26]/50 text-slate-400 text-xs">
            조건에 맞는 문제가 없습니다.
          </div>
        ) : (
          paginatedScenarios.map((item) => {
            const isSolved = (item.reviewCount || 0) >= 1;
            const lvl = getLevelBadge(item.difficultyStars);

            return (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-[#253346] bg-[#111a26] hover:bg-[#162335] hover:border-[#32435b] transition-colors gap-3"
              >
                {/* Left info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isSolved ? (
                      <div className="w-5 h-5 rounded-full bg-[#00ba7c]/20 text-[#00ba7c] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold font-mono ${lvl.style}`}>
                        {lvl.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.category}
                      </span>
                      {item.isGolden && (
                        <span className="text-[10px] text-amber-400 font-medium">★ 추천</span>
                      )}
                    </div>

                    <h3
                      onClick={() => onStartScenario(item)}
                      className="text-sm font-semibold text-white group-hover:text-[#0078ff] transition-colors cursor-pointer truncate"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#253346] shrink-0">
                  {onToggleBookmark && (
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`p-2 rounded-lg transition-colors text-slate-500 hover:text-amber-400 hover:bg-[#203046] ${
                        item.isBookmarked ? 'text-amber-400' : ''
                      }`}
                      title={item.isBookmarked ? '북마크 해제' : '북마크'}
                    >
                      <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {isSolved && (
                    <button
                      onClick={() => onReviewScenario(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#203046] hover:bg-[#2b3e5a] transition-colors"
                    >
                      해설
                    </button>
                  )}

                  <button
                    onClick={() => onStartScenario(item)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0078ff] hover:bg-[#0064d6] transition-colors shadow-sm"
                  >
                    {isSolved ? '다시 풀기' : '문제 풀기'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#253346] text-xs text-slate-400">
          <div className="text-[11px]">
            총 <span className="text-slate-200 font-semibold">{filteredScenarios.length}</span>개 중{' '}
            <span className="text-slate-200 font-semibold">
              {(validCurrentPage - 1) * pageSize + 1} - {Math.min(validCurrentPage * pageSize, filteredScenarios.length)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg border border-[#253346] bg-[#111a26] text-slate-300 hover:bg-[#1f2d3f] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="이전 페이지"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show current, edges, and immediate neighbors
                return p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-slate-500">...</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-colors ${
                        validCurrentPage === p
                          ? 'bg-[#0078ff] text-white font-semibold'
                          : 'border border-[#253346] bg-[#111a26] text-slate-300 hover:bg-[#1f2d3f]'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#253346] bg-[#111a26] text-slate-300 hover:bg-[#1f2d3f] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="다음 페이지"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
