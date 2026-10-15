import React, { useState, useEffect } from 'react';
import './ChatHistorySidebar.scss';
import { 
  getChatHistory, 
  deleteChatSession, 
  clearAllChatHistory, 
  subscribeToChatHistory, 
  groupChatsByTimeline 
} from '../../utils/chatHistory';
import { FiPlus, FiTrash2, FiChevronLeft } from 'react-icons/fi';
import { LuHistory, LuMessageSquare } from 'react-icons/lu';

const ChatHistorySidebar = ({
  isOpen,
  onClose,
  currentSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const [historyList, setHistoryList] = useState(() => getChatHistory());
  const [deletingId, setDeletingId] = useState(null);

  // Keep history synced with localStorage events
  useEffect(() => {
    setHistoryList(getChatHistory());
    const unsubscribe = subscribeToChatHistory((updatedList) => {
      setHistoryList(updatedList);
    });
    return unsubscribe;
  }, []);

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    setDeletingId(chatId);
    setTimeout(() => {
      deleteChatSession(chatId);
      setDeletingId(null);
    }, 180);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      clearAllChatHistory();
      if (onNewChat) onNewChat();
    }
  };

  const groupedChats = groupChatsByTimeline(historyList);

  const renderChatItem = (chat) => {
    const isActive = chat.id === currentSessionId;
    const isDeleting = deletingId === chat.id;

    return (
      <div
        key={chat.id}
        className={`pro-chat-row d-flex align-items-center justify-content-between ${isActive ? 'active' : ''} ${isDeleting ? 'deleting' : ''}`}
        onClick={() => onSelectSession(chat)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSelectSession(chat);
        }}
        title={chat.title}
      >
        <div className="pro-chat-left d-flex align-items-center gap-2 overflow-hidden flex-grow-1 me-2">
          <LuMessageSquare className="pro-chat-icon flex-shrink-0" />
          <span className="pro-chat-title text-truncate">
            {chat.title}
          </span>
        </div>

        <button
          className="btn p-0 pro-delete-btn flex-shrink-0 d-flex align-items-center justify-content-center rounded-2"
          onClick={(e) => handleDelete(e, chat.id)}
          title="Delete chat"
          aria-label="Delete chat"
        >
          <FiTrash2 className="pro-trash-icon" />
        </button>
      </div>
    );
  };

  const renderSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="pro-history-section mb-3" key={title}>
        <div className="pro-section-header px-3 py-1">
          {title}
        </div>
        <div className="pro-items-container d-flex flex-column gap-1 px-2">
          {items.map(renderChatItem)}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="chat-history-backdrop d-md-none" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`chat-history-sidebar pro-white-sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-inner-content">
          {/* Top Header: Clean Professional New Chat Button & Collapse Toggle */}
          <div className="pro-sidebar-top px-3 py-3 border-bottom d-flex align-items-center gap-2">
            <button
              className="btn pro-new-chat-btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm"
              onClick={onNewChat}
              title="Start a new chat"
            >
              <FiPlus className="pro-plus-icon" />
              <span className="pro-new-chat-text">New chat</span>
            </button>

            <button
              className="btn pro-collapse-btn rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              onClick={onClose}
              title="Collapse history"
              aria-label="Collapse history"
            >
              <FiChevronLeft style={{ fontSize: '18px' }} />
            </button>
          </div>

          {/* Scrollable Chat History Content */}
          <div className="sidebar-scroll-content flex-grow-1 overflow-y-auto py-2">
            {historyList.length === 0 ? (
              <div className="pro-empty-state text-center py-5 px-3">
                <div className="pro-empty-icon mx-auto mb-2 d-flex align-items-center justify-content-center">
                  <LuHistory style={{ fontSize: '22px' }} />
                </div>
                <p className="pro-empty-title mb-1 fw-semibold">No conversations</p>
                <p className="pro-empty-desc text-secondary mb-3" style={{ fontSize: '12px' }}>
                  Your chat history will be stored here.
                </p>
                <button
                  className="btn pro-empty-new-btn rounded-pill px-3 py-1 shadow-sm"
                  onClick={onNewChat}
                >
                  <FiPlus className="me-1" />
                  New chat
                </button>
              </div>
            ) : (
              <>
                {renderSection('Today', groupedChats.today)}
                {renderSection('Yesterday', groupedChats.yesterday)}
                {renderSection('Previous 7 Days', groupedChats.last7Days)}
                {renderSection('Older', groupedChats.older)}
              </>
            )}
          </div>

          {/* Bottom Footer Actions */}
          {historyList.length > 0 && (
            <div className="pro-sidebar-footer px-3 py-2 border-top d-flex align-items-center justify-content-between">
              <span className="pro-footer-count">
                {historyList.length} conversation{historyList.length !== 1 ? 's' : ''}
              </span>
              <button
                className="btn btn-sm pro-clear-all-btn d-flex align-items-center gap-1 py-1 px-2 rounded-2"
                onClick={handleClearAll}
                title="Clear all chat history"
              >
                <FiTrash2 style={{ fontSize: '12px' }} />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
