import React, { useState, useEffect } from "react";

interface Props {
  items: any[];
  pageSize: number;
  onPageChange: (paginatedItems: any[]) => void;
}

const Pagination: React.FC<Props> = ({ items, pageSize, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  console.log("size ", (currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const paginatedItems = items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    onPageChange(paginatedItems);
  }, [currentPage, onPageChange, items, pageSize]);

  return (
    <div className="flex gap-5 justify-center">
      <button
        className={`bg-secondary text-white p-2 rounded-md ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <button
        className={`bg-secondary text-white p-2 rounded-md ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
