import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDraggableBtn
 * Provides vertical-only dragging clamped to the viewport.
 *
 * @param {number} initialY  - Starting `top` position in px
 * @param {number} btnHeight - Approximate button height used for clamping (default 150)
 * @returns {{ top, setTop, topRef, onMouseDown }}
 */
export function useDraggableBtn(initialY, btnHeight = 150) {
  const topRef    = useRef(initialY);
  const [top, setTop] = useState(initialY);
  const dragging  = useRef(false);
  const startY    = useRef(0);
  const startTop  = useRef(0);

  const clamp = useCallback((v) => {
    const max = window.innerHeight - btnHeight;
    return Math.min(Math.max(0, v), max);
  }, [btnHeight]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startY.current   = e.clientY;
    startTop.current = topRef.current;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const next = clamp(startTop.current + (e.clientY - startY.current));
      topRef.current = next;
      setTop(next);
    };
    const onUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [clamp]);

  return { top, setTop, topRef, onMouseDown };
}
