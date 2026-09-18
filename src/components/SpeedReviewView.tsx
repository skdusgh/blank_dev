import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';
import { Scenario } from '../types';

interface SpeedReviewViewProps {
  scenarios: Scenario[];
  onRecordReview: (scenarioId: string) => void;
  onToggleBookmark: (scenarioId: string) => void;
  onGoToLab: (scenario: Scenario) => void;
  onGoToPIR: (scenario: Scenario) => void;
}

export const SpeedReviewView: React.FC<SpeedReviewViewProps> = ({
  scenarios,
  onRecordReview,
  onToggleBookmark,
  onGoToLab,
  onGoToPIR,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNMASTERED' | 'BOOKMARKED' | 'POCKET_3MIN'>('ALL');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const filteredScenarios = scenarios.filter((s) => {
    if (filterMode === 'UNMASTERED') return (s.reviewCount || 0) < 3;
    if (filterMode === 'BOOKMARKED') return s.isBookmarked;
    if (filterMode === 'POCKET_3MIN') return (s.estimatedTime || '').includes('3분');
    return true;
  });

  const activeScenario = filteredScenarios[currentIndex] || scenarios[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredScenarios.length - 1);
    }
  };

  const handleMarkMastered = () => {
    if (activeScenario) {
      onRecordReview(activeScenario.id);
      handleNext();
    }
  };

  const getMasteryBadge = (count = 0) => {
    if (count === 0) {
      return { text: '0회독 (미학습)', color: 'bg-[#111a26] text-slate-400 border border-[#253346]' };
    }
    if (count === 1) {
      return { text: '1회독 (원인 이해)', color: 'bg-[#0078ff]/15 text-[#3b82f6] border border-[#0078ff]/40' };
    }
    if (count === 2) {
      return { text: '2회독 (패턴 숙달)', color: 'bg-purple-950/40 text-purple-300 border border-purple-800/40' };
    }
    return { text: `${count}회독 (마스터 완료)`, color: 'bg-[#00ba7c]/15 text-[#00ba7c] border border-[#00ba7c]/40 font-bold' };
  };

  if (!activeScenario) {
    return (
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full text-slate-300">
        <p>선택된 필터 조건에 해당하는 시나리오가 없습니다.</p>
        <button
          onClick={() => setFilterMode('ALL')}
          className="mt-4 px-3 py-1.5 rounded-lg text-xs text-white bg-[#0078ff] font-bold"
        >
          전체 보기
        </button>
      </main>
    );
  }

  const badge = getMasteryBadge(activeScenario.reviewCount || 0);
  const detail = activeScenario.detail;

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 max-w-3xl mx-auto w-full space-y-5 text-slate-200">
      {/* Clean Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#253346] gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            스피드 복습
          </h1>
          <p className="text-xs text-slate-400">
            문제 코드를 보고 핵심 원인과 조치 원칙을 빠르게 상기해보세요.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#111a26] p-1 rounded-lg border border-[#253346] text-xs">
          <button
            onClick={() => {
              setFilterMode('ALL');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'ALL'
                ? 'bg-[#203046] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체 ({scenarios.length})
          </button>
          <button
            onClick={() => {
              setFilterMode('UNMASTERED');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'UNMASTERED'
                ? 'bg-[#203046] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            미완료
          </button>
          <button
            onClick={() => {
              setFilterMode('BOOKMARKED');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'BOOKMARKED'
                ? 'bg-[#203046] text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            북마크
          </button>
        </div>
      </div>

      {/* Mobile Touch Gesture Guide */}
      <div className="sm:hidden flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
        <span>👈 👉 스와이프로 넘기기</span>
        <span>카드 터치 시 원인 공개</span>
      </div>

      {/* Flashcard Box with Swipe Detection */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="rounded-xl border border-[#253346] bg-[#172334] shadow-md overflow-hidden transition-all select-none"
      >
        {/* Card Top Meta Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#253346] bg-[#111a26]/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-400 font-medium">
              {activeScenario.code}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111a26] text-slate-300 border border-[#253346]">
              {activeScenario.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${badge.color}`}>
              {badge.text}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onToggleBookmark(activeScenario.id)}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                activeScenario.isBookmarked
                  ? 'text-[#f59e0b] bg-[#f59e0b]/15 border-[#f59e0b]/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#203046] border-[#253346]'
              }`}
              title={activeScenario.isBookmarked ? '북마크 해제' : '복습용 북마크 추가'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => onGoToLab(activeScenario)}
              className="text-xs text-slate-400 hover:text-[#0078ff] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#203046] active:scale-95"
            >
              <span>실전 랩</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Question / Incident Title */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-[#0078ff] uppercase tracking-wider font-bold">
              장애 발생 시나리오
            </div>
            <h2 className="text-lg font-bold text-white">
              {activeScenario.title}
            </h2>
            <p className="text-xs text-slate-400">
              {activeScenario.description}
            </p>
          </div>

          {/* Front: Clues & Symptoms */}
          {!isFlipped ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#111a26] border border-[#253346] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white">발생 징후 (Symptom)</span>
                  <span className="font-mono text-slate-400">{detail.timeOccurred}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {detail.symptomText}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-400">
                  {detail.clueTitle}
                </div>
                <div className="p-3.5 rounded-lg bg-[#111a26] border border-[#253346] font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
                  {detail.clueSnippet}
                </div>
              </div>

              {/* Reveal CTA */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-3.5 rounded-xl border border-dashed border-[#253346] hover:border-[#0078ff] bg-[#111a26]/50 hover:bg-[#162335] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#0078ff]" />
                  <span>원인 및 해결 원칙 확인하기 (클릭하여 카드 뒤집기)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Back: Revealed Root Cause & Fix Rule */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Root Cause Box */}
              <div className="p-4 rounded-lg bg-[#111a26] border border-[#00ba7c]/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#00ba7c] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>핵심 근본 원인</span>
                  </span>
                  <span className="font-mono text-[#00ba7c] text-[11px] font-bold">
                    {detail.pir.improvementBadge}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-bold">
                  {detail.pir.rootCauseSummary}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {detail.pir.rootCauseDetail}
                </p>
              </div>

              {/* Fix Rule & Action */}
              <div className="p-4 rounded-lg bg-[#111a26] border border-[#253346] space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="text-[#0078ff]">💡</span>
                  <span>체득화 암기 원칙: {detail.rootCauseTheory.title}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="text-[#00ba7c] font-bold">조치 원칙:</span> {detail.rootCauseTheory.fixRule}
                </p>
              </div>

              {/* Quick Code Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#111a26] border border-red-500/40">
                  <div className="text-[11px] text-red-400 font-bold mb-1">❌ 개선 전 (Slow)</div>
                  <div className="text-slate-400 whitespace-pre overflow-x-auto text-[11px]">
                    {detail.pir.before.snippet}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#111a26] border border-[#00ba7c]/40">
                  <div className="text-[11px] text-[#00ba7c] font-bold mb-1">✅ 개선 후 (Fast)</div>
                  <div className="text-slate-200 whitespace-pre overflow-x-auto text-[11px]">
                    {detail.pir.after.snippet}
                  </div>
                </div>
              </div>

              {/* Re-hide button */}
              <button
                onClick={() => setIsFlipped(false)}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 mx-auto pt-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>문제 다시 숨기기</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Review Decision Buttons */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#253346] bg-[#111a26]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 sm:p-2 rounded-lg border border-[#253346] hover:bg-[#203046] text-slate-400 hover:text-white transition-all active:scale-95 min-h-[42px] sm:min-h-0 flex items-center justify-center flex-1 sm:flex-initial"
              title="이전 문제"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sm:hidden text-xs ml-1">이전</span>
            </button>
            <span className="text-xs text-slate-400 font-mono px-2">
              {currentIndex + 1} / {filteredScenarios.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2.5 sm:p-2 rounded-lg border border-[#253346] hover:bg-[#203046] text-slate-400 hover:text-white transition-all active:scale-95 min-h-[42px] sm:min-h-0 flex items-center justify-center flex-1 sm:flex-initial"
              title="다음 문제"
            >
              <span className="sm:hidden text-xs mr-1">다음</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onGoToPIR(activeScenario)}
              className="flex-1 sm:flex-initial px-3 py-2.5 sm:py-2 rounded-lg text-xs font-semibold text-slate-300 bg-[#203046] hover:bg-[#2b3e5a] border border-[#253346] transition-colors active:scale-95 min-h-[42px] sm:min-h-0"
            >
              상세 사후 리포트
            </button>

            <button
              onClick={handleMarkMastered}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold text-white bg-[#00ba7c] hover:bg-[#00a36c] transition-all shadow-sm active:scale-95 min-h-[42px] sm:min-h-0"
            >
              <Check className="w-4 h-4" />
              <span>체득 완료 (+1회독)</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
