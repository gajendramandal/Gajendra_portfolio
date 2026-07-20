'use client';

import { useState, useEffect, useCallback } from 'react';

interface TypeWriterProps {
  words: string[];
  className?: string;
}

export default function TypeWriter({ words, className = '' }: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  const word = words[currentWordIndex];

  const tick = useCallback(() => {
    if (phase === 'typing') {
      if (currentText.length < word.length) {
        setCurrentText(word.slice(0, currentText.length + 1));
      } else {
        setPhase('pausing');
      }
    } else if (phase === 'pausing') {
      // handled by separate timeout
    } else if (phase === 'deleting') {
      if (currentText.length > 0) {
        setCurrentText(word.slice(0, currentText.length - 1));
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setPhase('typing');
      }
    }
  }, [currentText, phase, word, words.length]);

  useEffect(() => {
    let speed: number;
    if (phase === 'typing') speed = 80;
    else if (phase === 'deleting') speed = 40;
    else speed = 2000; // pause duration

    const timeout = setTimeout(() => {
      if (phase === 'pausing') {
        setPhase('deleting');
      } else {
        tick();
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [tick, phase, currentText]);

  return (
    <span className={className}>
      {currentText}
      <span className="inline-block w-[2px] h-[1em] bg-purple-400 ml-1 animate-[blink_1s_infinite]" />
    </span>
  );
}
