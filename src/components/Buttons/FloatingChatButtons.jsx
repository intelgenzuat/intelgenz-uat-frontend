import React from 'react';
import { BsFillChatRightDotsFill } from 'react-icons/bs';
import { useDraggableBtn } from './useDraggableBtn';
import './DraggableChatBtn.scss';

/**
 * FloatingChatButtons
 * Renders the circular Intelgenz Chat button pinned to the right edge,
 * movable vertically.
 *
 * Props:
 *  - activeChatMode    {string|null} Current open mode ('voice' | 'text' | null)
 *  - onIntelgenzOpen   {function}    Called when the chat button is clicked
 */
export default function FloatingChatButtons({ activeChatMode, onIntelgenzOpen }) {
  const { top, isDragging, onPointerDown, handleClick } = useDraggableBtn(undefined, 58);

  return (
    <>
      {activeChatMode !== 'text' && (
        <button
          className={`floating-chat-icon-btn ${isDragging ? 'is-dragging' : ''}`}
          style={{
            top: `${top}px`,
            bottom: 'auto',
          }}
          onPointerDown={onPointerDown}
          onClick={handleClick(onIntelgenzOpen)}
          aria-label="Open Intelgenz Chat (Drag vertically to reposition)"
          title="Intelgenz Chat (Drag up/down to reposition)"
        >
          <BsFillChatRightDotsFill className="floating-chat-icon" />
        </button>
      )}
    </>
  );
}
