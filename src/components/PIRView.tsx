import React, { useState } from 'react';
import {
  RotateCcw,
  Check,
  X,
  ArrowRight,
  Award,
  Bookmark,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Scenario } from '../types';
import { GlossaryText } from './GlossaryText';

interface PIRViewProps {
  scenario: Scenario;
  onGoToDashboard: () => void;
  onRetry: () => void;
  onNextScenario: () => void;
  onRecordReview?: (scenarioId: string, notes?: string) => void;
  onToggleBookmark?: (scenarioId: string) => void;
}

export const PIRView: React.FC<PIRViewProps> = ({
  scenario,
  onGoToDashboard,
  onRetry,
  onNextScenario,
  onRecordReview,
  onToggleBookmark,
}) => {
  const detail = scenario.detail;
  const pir = detail?.pir;

  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [userNote, setUserNote] = useState(scenario.userNotes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!pir) {
    return (
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full text-slate-300">
        <p>사후 분석 리포트 데이터를 불러올 수 없습니다.</p>
        <button
          onClick={onGoToDashboard}
          className="mt-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0078ff]"
        >
          시나리오 목록으로 이동
        </button>
      </main>
    );
  }

  const reviewCount = scenario.reviewCount || 0;

  const handleCompleteReviewPass = () => {
    if (onRecordReview) {
      onRecordReview(scenario.id, userNote);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  const getMasteryTargetText = (count: number) => {
    if (count === 0) return '1회독 목표: 장애 증상과 근본 원인 연결하기';
    if (count === 1) return '2회독 목표: Before/After 코드 차이 직관화';
    if (count === 2) return '3회독 목표: 무의식적 코드 리뷰 & 실무 방어 체득';
    return `${count + 1}회독: 망각 방지 주기적 복습 유지`;
  };

  return (
    <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8 max-w-4xl mx-auto w-full space-y-5 sm:space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#253346] gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#00ba7c]/15 text-[#00ba7c] border border-[#00ba7c]/30">
              사후 분석 리포트 (PIR)
            </span>
            <span className="text-xs font-mono text-slate-400">
              {scenario.code || scenario.id} · {scenario.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111a26] text-blue-400 border border-[#253346]">
              {reviewCount}회독 완료됨
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {scenario.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(scenario.id)}
              className={`p-2 rounded-lg border text-xs transition-colors min-h-[38px] flex items-center justify-center ${
                scenario.isBookmarked
                  ? 'text-[#f59e0b] bg-[#f59e0b]/15 border-[#f59e0b]/40'
                  : 'text-slate-400 border-[#253346] hover:text-white hover:bg-[#203046]'
              }`}
              title={scenario.isBookmarked ? '북마크 해제' : '복습 북마크'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={onRetry}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#172334] hover:bg-[#203046] border border-[#253346] transition-colors active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>원인 진단 다시 풀기</span>
          </button>
          <button
            onClick={onGoToDashboard}
            className="flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-[#203046] hover:bg-[#2b3e5a] border border-[#253346] transition-colors active:scale-95 text-center"
          >
            시나리오 목록
          </button>
        </div>
      </div>

      {/* 1. Incident Summary */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-[#0078ff] uppercase tracking-wider font-mono">
          1. 장애 근본 원인 분석 (Root Cause Analysis)
        </h2>
        <div className="rounded-xl border border-[#253346] bg-[#172334] p-4 text-xs text-slate-300 leading-relaxed space-y-2 shadow-sm">
          <p>
            <strong className="text-white font-bold">근본 원인: </strong>
            <GlossaryText text={pir.rootCauseSummary} />
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            <GlossaryText text={pir.rootCauseDetail} />
          </p>
        </div>
      </section>

      {/* 2. Before vs After Comparison (Core Learning) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0078ff] uppercase tracking-wider font-mono">
            2. Before & After 개선 코드 및 성능 지표 비교
          </h2>
          <span className="text-xs font-bold text-[#00ba7c] bg-[#00ba7c]/15 border border-[#00ba7c]/30 px-2.5 py-0.5 rounded-lg">
            {pir.improvementBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="rounded-xl border border-red-500/40 bg-[#172334] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#253346] pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                <X className="w-4 h-4" />
                <span>{pir.before.title}</span>
              </span>
              <span className="text-[11px] font-mono text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-950/40 border border-red-800/40">
                {pir.before.badge}
              </span>
            </div>

            {/* Code Snippet */}
            <div className="rounded-lg bg-[#111a26] p-3 border border-[#253346] font-mono text-[11px] sm:text-xs text-slate-300 overflow-x-auto whitespace-pre no-scrollbar">
              {pir.before.snippet}
            </div>

            {/* Metrics */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              {pir.before.metrics.map((m, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{m.label}:</span>
                  <span className={`font-mono ${m.isBad ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="rounded-xl border border-[#00ba7c]/40 bg-[#172334] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#253346] pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#00ba7c]">
                <Check className="w-4 h-4" />
                <span>{pir.after.title}</span>
              </span>
              <span className="text-[11px] font-mono text-[#00ba7c] font-bold px-1.5 py-0.5 rounded bg-[#00ba7c]/20 border border-[#00ba7c]/40">
                {pir.after.badge}
              </span>
            </div>

            {/* Code Snippet */}
            <div className="rounded-lg bg-[#111a26] p-3 border border-[#253346] font-mono text-[11px] sm:text-xs text-slate-200 overflow-x-auto whitespace-pre no-scrollbar">
              {pir.after.snippet}
            </div>

            {/* Metrics */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              {pir.after.metrics.map((m, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{m.label}:</span>
                  <span className="font-mono text-[#00ba7c] font-bold">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Rules & Takeaways */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[#0078ff] uppercase tracking-wider font-mono">
          3. 실무 핵심 예방 수칙 (Architecture Takeaways)
        </h2>

        <div className="rounded-xl border border-[#253346] bg-[#172334] p-4 space-y-3 text-xs leading-relaxed shadow-sm">
          {pir.takeaways.map((item) => (
            <div
              key={item.num}
              className={`flex items-start gap-3 ${
                item.num > 1 ? 'border-t border-[#253346] pt-3' : ''
              }`}
            >
              <span className="w-5 h-5 rounded-md bg-[#0078ff]/15 text-[#0078ff] border border-[#0078ff]/30 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                {item.num}
              </span>
              <div>
                <strong className="text-white text-xs font-bold">{item.title}</strong>
                <p className="text-slate-400 mt-1 leading-relaxed text-xs">
                  <GlossaryText text={item.description} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Multi-pass Review & Mastery Pass Certification (체득화 인증) */}
      <section className="rounded-xl border border-blue-500/30 bg-[#172334] p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#253346] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0078ff]" />
            <span className="text-xs font-bold text-white">
              다회독 체득화 인증 (현재 {reviewCount}회독 달성)
            </span>
          </div>
          <span className="text-[11px] text-[#0078ff] font-mono font-semibold">
            {getMasteryTargetText(reviewCount)}
          </span>
        </div>

        {/* Self-check checklist */}
        <div className="space-y-2 text-xs">
          <div className="text-slate-300 font-bold">이번 회독 자가 점검 (Self-Check):</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2.5 p-2.5 sm:p-2 rounded-lg bg-[#111a26] border border-[#253346] cursor-pointer min-h-[44px] hover:border-[#0078ff]/50">
              <input
                type="checkbox"
                checked={check1}
                onChange={(e) => setCheck1(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0078ff] shrink-0"
              />
              <span className="text-slate-200 text-xs font-medium">원인 1줄 설명 가능</span>
            </label>
            <label className="flex items-center gap-2.5 p-2.5 sm:p-2 rounded-lg bg-[#111a26] border border-[#253346] cursor-pointer min-h-[44px] hover:border-[#0078ff]/50">
              <input
                type="checkbox"
                checked={check2}
                onChange={(e) => setCheck2(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0078ff] shrink-0"
              />
              <span className="text-slate-200 text-xs font-medium">문제 코드 즉시 식별</span>
            </label>
            <label className="flex items-center gap-2.5 p-2.5 sm:p-2 rounded-lg bg-[#111a26] border border-[#253346] cursor-pointer min-h-[44px] hover:border-[#0078ff]/50">
              <input
                type="checkbox"
                checked={check3}
                onChange={(e) => setCheck3(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0078ff] shrink-0"
              />
              <span className="text-slate-200 text-xs font-medium">실무 예방 수칙 이해</span>
            </label>
          </div>
        </div>

        {/* User Note */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-400 flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>나만의 체득 메모 (실무 적용 포인트 / 주의사항):</span>
          </label>
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="예: 정렬 컬럼 복합인덱스 순서 반드시 체크할 것"
            className="w-full px-3 py-2.5 rounded-lg bg-[#111a26] border border-[#253346] text-sm sm:text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#0078ff]"
          />
        </div>

        {/* Pass Completion Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {isSavedNotice ? (
            <span className="text-xs text-[#00ba7c] flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{reviewCount + 1}회독 체득 완료가 기록되었습니다!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              체득 완료를 누르면 회독수와 최근 복습일자가 저장됩니다.
            </span>
          )}

          <button
            onClick={handleCompleteReviewPass}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold text-white bg-[#0078ff] hover:bg-[#0064d6] transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>이번 회독 완료 (+1회독 기록)</span>
          </button>
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="pt-2 border-t border-[#253346] flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 items-center justify-between">
        <button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← 시나리오 목록으로 이동
        </button>

        <button
          onClick={onNextScenario}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0078ff] hover:bg-[#0064d6] transition-all active:scale-95 shadow-md"
        >
          <span>다음 시나리오 도전</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </main>
  );
};


