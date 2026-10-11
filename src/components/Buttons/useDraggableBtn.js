import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'intelgenz_chat_btn_top';
const DEFAULT_BTN_HEIGHT = 58;
const PADDING = 20;

/**
 * useDraggableBtn
 * Provides vertical-only dragging clamped to the viewport,
 * with persistence, resize-safety, and click-vs-drag distinction.
 *
 * @param {number} [initialY]  - Optional default `top` in px
 * @param {number} [btnHeight] - Button height for clamping (default 58)
 * @returns {{ top, setTop, topRef, isDragging, onPointerDown, handleClick, onMouseDown }}
 */
export function useDraggableBtn(initialY, btnHeight = DEFAULT_BTN_HEIGHT) {
  const getInitialTop = useCallback(() => {
    const max = Math.max(
      PADDING,
      (typeof window !== 'undefined' ? window.innerHeight : 800) - btnHeight - PADDING
    );
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) {
          return Math.min(Math.max(PADDING, parsed), max);
        }
      }
    } catch (_) {}

    if (typeof initialY === 'number') {
      return Math.min(Math.max(PADDING, initialY), max);
    }

    // Default position: 24px above viewport bottom
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return Math.max(PADDING, winHeight - btnHeight - 24);
  }, [initialY, btnHeight]);

  const [top, setTop] = useState(getInitialTop);
  const [isDragging, setIsDragging] = useState(false);
  const topRef = useRef(top);
  topRef.current = top;

  const dragInfo = useRef({
    startY: 0,
    startTop: 0,
    isActive: false,
    hasMoved: false,
  });

  const clamp = useCallback(
    (y) => {
      const max = Math.max(
        PADDING,
        (typeof window !== 'undefined' ? window.innerHeight : 800) - btnHeight - PADDING
      );
      return Math.min(Math.max(PADDING, y), max);
    },
    [btnHeight]
  );

  // Handle window resizing to keep button within bounds
  useEffect(() => {
    const onResize = () => {
      setTop((prev) => {
        const next = clamp(prev);
        topRef.current = next;
        return next;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp]);

  const onPointerDown = useCallback((e) => {
    // Only primary button (left click)
    if (e.button !== undefined && e.button !== 0) return;

    dragInfo.current = {
      startY: e.clientY,
      startTop: topRef.current,
      isActive: true,
      hasMoved: false,
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragInfo.current.isActive) return;

      const deltaY = e.clientY - dragInfo.current.startY;
      if (!dragInfo.current.hasMoved && Math.abs(deltaY) > 4) {
        dragInfo.current.hasMoved = true;
        setIsDragging(true);
      }

      if (dragInfo.current.hasMoved) {
        const next = clamp(dragInfo.current.startTop + deltaY);
        topRef.current = next;
        setTop(next);
      }
    };

    const onPointerUp = () => {
      if (!dragInfo.current.isActive) return;

      if (dragInfo.current.hasMoved) {
        try {
          localStorage.setItem(STORAGE_KEY, String(topRef.current));
        } catch (_) {}
      }

      dragInfo.current.isActive = false;
      setIsDragging(false);

      // Keep hasMoved true briefly so onClick handler can prevent opening drawer
      setTimeout(() => {
        dragInfo.current.hasMoved = false;
      }, 100);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [clamp]);

  const handleClick = useCallback(
    (handler) => (e) => {
      if (dragInfo.current.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (handler) {
        handler(e);
      }
    },
    []
  );

  return {
    top,
    setTop,
    topRef,
    isDragging,
    onPointerDown,
    handleClick,
    onMouseDown: onPointerDown,
  };
}
