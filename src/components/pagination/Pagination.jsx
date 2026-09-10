import React, { useState } from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 20,
  totalItems = 120,
  pageSize = 9,
  onPageChange,
}) {
  const [jumpPage, setJumpPage] = useState('');

  const startItem = String((currentPage - 1) * pageSize + 1).padStart(2, '0');
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

          <button
            type="button"
            className={`intelcard-pagination-btn ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => handlePageClick(1)}
          >
            1
          </button>

          {[2, 3, 4, 5].map((page) => (
            page <= totalPages && (
              <button
                key={page}
                type="button"
                className={`btn btn-sm btn-light bg-transparent border-0 ${currentPage === page ? 'text-primary fw-bold' : 'text-secondary'}`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            )
          ))}

          {totalPages > 5 && (
            <>
              <span className="intelcard-pagination-ellipsis">...</span>
              <button
                type="button"
                className={`btn btn-sm btn-light bg-transparent border-0 ${currentPage === totalPages ? 'text-primary fw-bold' : 'text-secondary'}`}
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

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
            placeholder="101"
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
