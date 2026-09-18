import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Code2,
  Activity,
  Terminal,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Scenario } from '../types';
import { GlossaryText } from './GlossaryText';

interface ActiveLabViewProps {
  scenario: Scenario;
  onProceedToReview: () => void;
  onRecordReview?: (scenarioId: string) => void;
}

export const ActiveLabView: React.FC<ActiveLabViewProps> = ({
  scenario,
  onProceedToReview,
  onRecordReview,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [reviewRecorded, setReviewRecorded] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    setSelectedOption(null);
    setReviewRecorded(false);
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [scenario.id]);

  const detail = scenario.detail;

  if (!detail) {
    return (
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full text-slate-300">
        <p>시나리오 상세 정보를 불러올 수 없습니다.</p>
      </main>
    );
  }

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(detail.clueSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (detail.options[index]?.isCorrect && onRecordReview && !reviewRecorded) {
      onRecordReview(scenario.id);
      setReviewRecorded(true);
    }
  };

  const isSelectedCorrect =
    selectedOption !== null && detail.options[selectedOption]?.isCorrect;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getLevelBadge = (stars: number) => {
    switch (stars) {
      case 1:
        return { label: 'Lv.1', style: 'text-[#00ba7c] bg-[#00ba7c]/10 border-[#00ba7c]/30' };
      case 2:
        return { label: 'Lv.2', style: 'text-[#3b82f6] bg-[#0078ff]/10 border-[#0078ff]/30' };
      case 3:
        return { label: 'Lv.3', style: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30' };
      case 4:
      default:
        return { label: 'Lv.4', style: 'text-[#a855f7] bg-[#8b5cf6]/10 border-[#8b5cf6]/30' };
    }
  };

  const lvl = getLevelBadge(scenario.difficultyStars);

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 max-w-4xl mx-auto w-full space-y-6">
      {/* 1. Header Bar: Title & Metadata */}
      <header className="pb-4 border-b border-[#253346] space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${lvl.style}`}>
                {lvl.label}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {scenario.category}
              </span>
              <span className="text-xs font-mono text-slate-500">
                · {scenario.code || scenario.id}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {scenario.title}
            </h1>
          </div>

          {/* Timer & Quick Link */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111a26] border border-[#253346] text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-white tracking-wider">{formatTimer(elapsedSeconds)}</span>
            </div>

            <button
              onClick={onProceedToReview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#203046] hover:bg-[#2b3e5a] transition-colors"
            >
              <span>해설 리포트</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
          <GlossaryText text={scenario.description} />
        </p>

        {/* Subtle Glossary Hint */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400/90 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
          <span>점선 밑줄 표시된 기술 용어/약어에 마우스를 올리면 쉬운 설명을 확인할 수 있습니다.</span>
        </div>
      </header>

      {/* TOP-TO-BOTTOM PROBLEM SOLVING FLOW */}

      {/* STEP 1: Symptom & Monitoring Metrics */}
      <section className="rounded-xl border border-[#253346] bg-[#111a26] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs border-b border-[#253346]/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#0078ff]/15 text-[#0078ff] flex items-center justify-center font-bold text-[11px] font-mono">
              1
            </span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#0078ff]" />
              발생 징후 & 실시간 모니터링
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 bg-[#172334] px-2 py-0.5 rounded border border-[#253346]">
            발생 시각: {detail.timeOccurred}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {detail.metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border ${
                metric.isDanger
                  ? 'bg-red-950/20 border-red-500/30'
                  : 'bg-[#172334] border-[#253346]'
              }`}
            >
              <div className="text-[11px] text-slate-400 truncate font-medium">{metric.label}</div>
              <div
                className={`text-sm sm:text-base font-bold font-mono mt-0.5 truncate tracking-tight ${
                  metric.isDanger ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Symptom Explanation */}
        <div className="bg-[#172334]/60 rounded-lg p-3 border border-[#253346]/60 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <GlossaryText text={detail.symptomText} />
        </div>
      </section>

      {/* STEP 2: Problem Code Snippet */}
      <section className="rounded-xl border border-[#253346] bg-[#111a26] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs border-b border-[#253346]/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#0078ff]/15 text-[#0078ff] flex items-center justify-center font-bold text-[11px] font-mono">
              2
            </span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#0078ff]" />
              {detail.clueTitle}
            </span>
          </div>

          <button
            onClick={handleCopySnippet}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs bg-[#172334] px-2.5 py-1 rounded-md border border-[#253346] transition-colors"
            title="코드 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00ba7c]" />
                <span className="text-[#00ba7c] font-medium">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>코드 복사</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block with JetBrains Mono */}
        <div className="rounded-lg bg-[#0a111a] p-3.5 sm:p-4 border border-[#253346] font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed overflow-x-auto whitespace-pre selection:bg-[#0078ff] selection:text-white">
          {detail.clueSnippet}
        </div>

        {/* Tip / Key Hint */}
        <div className="text-xs text-slate-300 flex items-start gap-2 bg-[#172334]/70 p-2.5 sm:p-3 rounded-lg border border-[#253346]/70">
          <span className="text-amber-400 font-bold shrink-0">HINT</span>
          <span className="leading-relaxed">
            <strong className="text-white">분석 단서:</strong> <GlossaryText text={detail.clueTip} />
          </span>
        </div>
      </section>

      {/* STEP 3: Execution Plan / Stack Trace Observation */}
      <section className="rounded-xl border border-[#253346] bg-[#111a26] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs border-b border-[#253346]/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#0078ff]/15 text-[#0078ff] flex items-center justify-center font-bold text-[11px] font-mono">
              3
            </span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#00ba7c]" />
              {detail.planTitle}
            </span>
          </div>

          <span className="text-xs font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 font-semibold">
            {detail.planBadge}
          </span>
        </div>

        {/* Table / Diagnostic Log */}
        <div className="border border-[#253346] rounded-lg overflow-x-auto text-xs bg-[#0a111a]">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#172334] text-slate-300 text-xs border-b border-[#253346]">
              <tr>
                {detail.planHeaders.map((header, idx) => (
                  <th key={idx} className="py-2.5 px-3 font-semibold whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#253346]/50 text-slate-300 text-xs">
              {detail.planRows.map((row, idx) => (
                <tr key={idx} className={row.isDanger ? 'bg-red-950/20' : ''}>
                  <td className={`py-2 px-3 whitespace-nowrap ${row.isDanger ? 'text-red-400 font-semibold' : ''}`}>
                    {row.col1}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{row.col2}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{row.col3}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${row.isDanger ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                    {row.col4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5">
          <GlossaryText text={detail.planExplanation} />
        </p>
      </section>

      {/* STEP 4: Root Cause Diagnosis & Quiz */}
      <section className="rounded-xl border border-[#253346] bg-[#111a26] p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#253346]/80 pb-2.5">
          <span className="w-5 h-5 rounded-md bg-[#00ba7c]/15 text-[#00ba7c] flex items-center justify-center font-bold text-[11px] font-mono">
            4
          </span>
          <span className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-[#00ba7c]" />
            원인 진단 & 정답 선택
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            위 지표와 단서를 종합했을 때, 이 장애의 근본 원인은 무엇일까요?
          </h2>
          <p className="text-xs text-slate-400">
            가장 정확한 원인을 진단하면 즉시 채점 결과와 조치 원칙이 표시됩니다.
          </p>
        </div>

        {/* Vertical Option Stack (1, 2, 3, 4) */}
        <div className="space-y-2.5">
          {detail.options.map((option, idx) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3.5 ${
                  isSelected
                    ? option.isCorrect
                      ? 'border-[#00ba7c] bg-[#00ba7c]/15 text-white shadow-sm ring-1 ring-[#00ba7c]/50'
                      : 'border-red-500 bg-red-950/30 text-white shadow-sm ring-1 ring-red-500/50'
                    : 'border-[#253346] bg-[#172334] text-slate-300 hover:border-slate-500 hover:bg-[#1c2a3e]'
                }`}
              >
                {/* Number Badge */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? option.isCorrect
                        ? 'bg-[#00ba7c] text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-[#111a26] text-slate-400 border border-[#253346]'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-semibold text-white flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base">
                      <GlossaryText text={option.title} />
                    </span>
                    {isSelected && (
                      option.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00ba7c] shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )
                    )}
                  </div>
                  <div className="text-xs sm:text-xs text-slate-400 leading-relaxed">
                    <GlossaryText text={option.description} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Feedback Banner */}
        {selectedOption !== null && (
          <div
            className={`rounded-xl p-4 sm:p-4.5 border space-y-3 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
              isSelectedCorrect
                ? 'bg-[#172334] border-[#00ba7c]/50'
                : 'bg-[#172334] border-red-500/50'
            }`}
          >
            <div className="font-bold flex items-center gap-2 text-sm sm:text-base">
              {isSelectedCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#00ba7c]" />
                  <span className="text-[#00ba7c]">정답입니다! 정확한 원인을 짚어내셨습니다.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">오답입니다. 단서 2와 3의 지표를 다시 확인해보세요.</span>
                </>
              )}
            </div>

            <div className="font-semibold text-white pt-1">
              핵심 이론: <GlossaryText text={detail.rootCauseTheory.title} />
            </div>

            <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-xs sm:text-xs pl-1">
              {detail.rootCauseTheory.points.map((pt, idx) => (
                <li key={idx}>
                  <span><GlossaryText text={pt} /></span>
                </li>
              ))}
            </ul>

            <div className="pt-2.5 border-t border-[#253346] text-xs text-slate-300">
              <strong className="text-[#00ba7c]">실무 조치 원칙:</strong> <GlossaryText text={detail.rootCauseTheory.fixRule} />
            </div>
          </div>
        )}

        {/* Next Action: PIR Comparison Report */}
        <div className="pt-2">
          <button
            onClick={onProceedToReview}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0078ff] hover:bg-[#0064d6] transition-colors shadow-md active:scale-[0.99]"
          >
            <span>Before & After 성능 개선 리포트 (PIR) 확인하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
