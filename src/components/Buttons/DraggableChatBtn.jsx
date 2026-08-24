import React, { forwardRef } from 'react';
import './DraggableChatBtn.scss';

/**
 * DraggableChatBtn
 * A single draggable tab button pinned to the right edge of the viewport.
 *
 * Props:
 *  - top          {number}    Current top position (px) — controlled by parent
 *  - onMouseDown  {function}  Drag start handler from useDraggableBtn
 *  - onClick      {function}  Click handler to open the associated drawer
 *  - borderColor  {string}    Optional border accent colour (default '#e2e8f0')
 *  - label        {string}    Vertical text label
 *  - icon         {ReactNode} Icon rendered at the bottom of the button
 */
const DraggableChatBtn = forwardRef(function DraggableChatBtn(
  { top, onMouseDown, onClick, borderColor, label, icon },
  ref
) {
  return (
    <button
      ref={ref}
      className="draggable-chat-btn bg-white shadow-sm py-3"
      style={{
        top,
        borderColor: borderColor ?? '#e2e8f0',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <i className="bi bi-chevron-left text-secondary" style={{ fontSize: '14px' }} />
      <span className="draggable-chat-btn__label">{label}</span>
      <span className="draggable-chat-btn__icon">{icon}</span>
    </button>
  );
});

export default DraggableChatBtn;
