import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Pagination.scss";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface PaginationProps {
  totalData: number;
  perPage: number;
  currentPage: number;
  onChange: (page: number) => void;
  style?: React.CSSProperties;
  className?: string;
  navigateTo?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalData,
  perPage = 5,
  currentPage = 1,
  onChange,
  className,
  style,
  navigateTo = "page",
}) => {
  const totalPages = Math.ceil(totalData / perPage);
  const navigate = useNavigate();

  const getRange = () => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftCount = 1 + 2 * siblingCount;
      const leftRange = range(1, leftCount);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightCount = 1 + 2 * siblingCount;
      const rightRange = range(totalPages - rightCount + 1, totalPages);
      return [1, "...", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "...", ...middleRange, "...", totalPages];
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page);
      navigate(`?${navigateTo}=${page}`);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers: any[] = [];
    const pages = getRange();
    pages?.forEach((page, index) => {
      pageNumbers.push(
        <button
          key={index}
          className={`px-3 py-1 duration-150 rounded text-[var(--dark-text)] hover:text-[var(--dark-text)]  hover:bg-[var(--light-background)] ${
            typeof page === "number" ? "pagination-page" : "not-btn"
          } ${
            page === currentPage
              ? " text-[var(--dark-text)] bg-red-500 hover:!bg-red-600  "
              : ""
          }`}
          style={{
            cursor: typeof page !== "number" ? "default" : "pointer",
          }}
          onClick={() => {
            if (typeof page === "number") handlePageChange(page);
          }}
        >
          {page}
        </button>
      );
    });
    return pageNumbers;
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-center flex-nowrap py-[20px] px-[50px] ">
        <div className="flex items-center justify-center gap-5" style={style}>
          <div className="flex items-center justify-center gap-2 ">
            <button
              disabled={currentPage === 1}
              className={`bg-[var(--light-background)]   ${
                currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              } p-2 rounded hover:bg-[var(--dark-foreground)] hover:text-[var(--light-foreground)] duration-150`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft />
            </button>
          </div>

          <div
            className={`flex items-center justify-center  gap-2 ${
              className ? className : ""
            }`}
          >
            <button className="px-3 bg-red-500 hover:bg-red-600 py-1 duration-150 rounded text-[var(--dark-text)] hover:text-[var(--dark-text)]  hover:bg-[var(--light-background)]">
              {currentPage}{" "}
            </button>{" "}
            <p className=" text-[18px] ">of</p>
            <p className="text-[18px]">{totalPages}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              className={`bg-[var(--light-background)] p-2 rounded hover:bg-[var(--dark-foreground)] hover:text-[var(--light-foreground)] duration-150 ${
                currentPage === totalPages
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
