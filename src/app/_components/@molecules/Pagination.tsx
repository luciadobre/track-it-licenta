"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages < 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <ul className="mt-6 flex list-none justify-center gap-1 text-sm">
      <li
        className={`rounded px-2 py-1 ${
          currentPage === 1
            ? "text-text-secondary"
            : "cursor-pointer hover:bg-box-background-hover"
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        {"<"}
      </li>

      {getPageNumbers().map((page, idx) => (
        <li
          key={idx}
          className={`rounded px-2 py-1 ${
            page === currentPage
              ? "bg-accent text-text-primary"
              : page === "..."
                ? "text-text-secondary"
                : "cursor-pointer hover:bg-box-background-hover"
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
        >
          {page}
        </li>
      ))}

      <li
        className={`rounded px-2 py-1 ${
          currentPage === totalPages
            ? "text-text-secondary"
            : "cursor-pointer hover:bg-box-background-hover"
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
      >
        {">"}
      </li>
    </ul>
  );
};

export default Pagination;
