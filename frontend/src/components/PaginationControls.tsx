interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <p>
        Page {currentPage} of {totalPages}
      </p>

      <div>
        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(Math.max(1, currentPage - 1))
          }
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={
              pageNumber === currentPage
                ? "pagination-button active"
                : "pagination-button"
            }
            aria-current={
              pageNumber === currentPage
                ? "page"
                : undefined
            }
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(
              Math.min(totalPages, currentPage + 1)
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
