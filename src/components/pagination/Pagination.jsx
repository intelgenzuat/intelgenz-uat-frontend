import React, { useState } from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 9,
  onPageChange,
}) {
  const [jumpPage, setJumpPage] = useState('');

  const startItem = totalItems === 0 ? 0 : String((currentPage - 1) * pageSize + 1).padStart(2, '0');
  const endItem = String(Math.min(currentPage * pageSize, totalItems)).padStart(2, '0');

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handleJump = (e) => {
    e?.preventDefault?.();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      if (onPageChange) {
        onPageChange(pageNum);
      }
      setJumpPage('');
    }
  };

  // Helper to generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="intelcard-pagination-wrapper">
      <div className="intelcard-pagination-container shadow-sm">
        <span className="intelcard-pagination-info">
          {startItem}-{endItem} of {totalItems}
        </span>
        <div className="intelcard-pagination-controls">
          <button
            type="button"
            className="intelcard-pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {getPageNumbers().map((item, index) => {
            if (item === '...') {
              return (
                <span key={`ellipsis-${index}`} className="intelcard-pagination-ellipsis">
                  ...
                </span>
              );
            }
            return (
              <button
                key={item}
                type="button"
                className={`intelcard-pagination-btn ${currentPage === item ? 'active' : ''}`}
                onClick={() => handlePageClick(item)}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            className="intelcard-pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="intelcard-pagination-page-jump">
          <span>Page</span>
          <input
            type="text"
            className="intelcard-pagination-input"
            value={jumpPage}
            placeholder={String(currentPage)}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJump(e);
            }}
          />
          <button type="button" className="intelcard-pagination-go-btn" onClick={handleJump}>
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
