'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function Typewriter({ 
  words, 
  typingSpeed = 150, 
  deletingSpeed = 100, 
  pauseDuration = 2000,
  className = ""
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (!words || words.length === 0) return;

    if (subIndex === words[index].length + 1 && !isDeleting) {
      // Finished typing word, wait before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

  if (!words || words.length === 0) return null;

  return (
    <span className={className}>
      {words[index].substring(0, subIndex)}
      <span className={`inline-block w-[2px] h-[1em] md:h-[0.9em] bg-red-600 ml-1 align-middle ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
    </span>
  );
}
