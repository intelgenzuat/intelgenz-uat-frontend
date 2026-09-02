import React from 'react';
import { BsFillChatRightDotsFill } from 'react-icons/bs';
import './DraggableChatBtn.scss';

/**
 * FloatingChatButtons
 * Renders the circular Intelgenz Chat button in the bottom-right corner.
 *
 * Props:
 *  - activeChatMode    {string|null} Current open mode ('voice' | 'text' | null)
 *  - onIntelgenzOpen   {function}    Called when the chat button is clicked
 */
export default function FloatingChatButtons({ activeChatMode, onIntelgenzOpen }) {
  return (
    <>
      {activeChatMode !== 'text' && (
        <button
          className="floating-chat-icon-btn"
          onClick={onIntelgenzOpen}
          aria-label="Open Intelgenz Chat"
          title="Open Intelgenz Chat"
        >
          <BsFillChatRightDotsFill className="floating-chat-icon" />
        </button>
      )}
    </>
  );
}
