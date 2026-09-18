import React, { useState, useRef, useEffect } from 'react';
import { GlossaryTerm } from '../data/glossaryData';
import { HelpCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface TermTooltipProps {
  term: GlossaryTerm;
  children: React.ReactNode;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ term, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'top' | 'bottom' }>({
    top: 0,
    left: 0,
    placement: 'top',
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 160;

    // Check vertical space
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement: 'top' | 'bottom' = spaceAbove > tooltipHeight + 20 ? 'top' : 'bottom';

    // Calculate left bounded to viewport
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 12) left = 12;
    if (left + tooltipWidth > window.innerWidth - 12) {
      left = window.innerWidth - tooltipWidth - 12;
    }

    const top = placement === 'top' ? rect.top - 8 : rect.bottom + 8;

    setCoords({ top, left, placement });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getCategoryColor = (cat: string) => {
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
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        updatePosition();
        setIsVisible((v) => !v);
      }}
      className="inline-block relative cursor-help underline decoration-dotted decoration-slate-400/60 hover:decoration-sky-400 hover:text-sky-300 transition-colors"
      title="용어 설명 보기 (클릭/호버)"
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsVisible(true);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            top: coords.placement === 'top' ? `${coords.top}px` : `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.placement === 'top' ? 'translateY(-100%)' : 'none',
            zIndex: 99999,
          }}
          className="w-80 p-3.5 rounded-xl border border-[#2d3f56] bg-[#0c1420]/95 backdrop-blur-md shadow-2xl text-left font-sans text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-[#213044] pb-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white text-[13px]">{term.term}</span>
                {term.shortName && term.shortName !== term.term && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {term.shortName}
                  </span>
                )}
              </div>
              {term.fullName && (
                <div className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
                  {term.fullName}
                </div>
              )}
            </div>

            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 border ${getCategoryColor(
                term.category
              )}`}
            >
              {term.categoryLabel}
            </span>
          </div>

          {/* Explanation */}
          <p className="text-[11.5px] leading-relaxed text-slate-300 mb-2">
            {term.summary}
          </p>

          {/* Impact / Production Tip */}
          {term.impactTip && (
            <div className="pt-2 border-t border-[#1a2738] flex items-start gap-1.5 text-[10.5px] text-amber-300/90 leading-tight">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-400">실무 주의:</strong> {term.impactTip}
              </span>
            </div>
          )}
        </div>
      )}
    </span>
  );
};
