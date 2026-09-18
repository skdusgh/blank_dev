import React, { useMemo } from 'react';
import { GLOSSARY_MAP, SORTED_GLOSSARY_KEYS } from '../data/glossaryData';
import { TermTooltip } from './TermTooltip';

interface GlossaryTextProps {
  text: string;
  disabled?: boolean;
  className?: string;
}

// Helper to escape regex special characters
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const GlossaryText: React.FC<GlossaryTextProps> = ({
  text,
  disabled = false,
  className,
}) => {
  const elements = useMemo(() => {
    if (!text || disabled) return text;

    // Build regex pattern from sorted glossary keys
    // Match exact word boundaries for pure Latin/alphanumeric words, direct match for Korean
    const patterns = SORTED_GLOSSARY_KEYS.map((key) => {
      const escaped = escapeRegex(key);
      // If purely ASCII letters/numbers, require boundary
      if (/^[a-zA-Z0-9_-]+$/.test(key)) {
        return `\\b${escaped}\\b`;
      }
      return escaped;
    });

    const regex = new RegExp(`(${patterns.join('|')})`, 'gi');
    const parts = text.split(regex);

    // Track matched terms per sentence/block to avoid repeating tooltips on every single instance of common words (max 2 per term in a block)
    const termCountMap = new Map<string, number>();

    return parts.map((part, index) => {
      if (!part) return null;

      const lower = part.toLowerCase();
      const matchedTerm = GLOSSARY_MAP.get(lower);

      if (matchedTerm) {
        const count = termCountMap.get(matchedTerm.term) || 0;
        if (count < 2) {
          termCountMap.set(matchedTerm.term, count + 1);
          return (
            <TermTooltip key={`${matchedTerm.term}-${index}`} term={matchedTerm}>
              {part}
            </TermTooltip>
          );
        }
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text, disabled]);

  return <span className={className}>{elements}</span>;
};
