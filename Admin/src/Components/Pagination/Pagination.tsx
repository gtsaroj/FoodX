import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaginationProps {
  totalData: number;
  currentPage: number;
  perPage: number;
  onChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  totalData,
  perPage,
  currentPage,
  onChange,
}: {
  totalData: number;
  perPage: number;
  currentPage: number;
  onChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalData / perPage);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page);
      navigate(?page=${page});
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-page px-5 py-2  ${i === currentPage ? " active  " : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center w-full h-full px-5 py-2 pagination-container">
      <div className="flex items-center justify-center pagination ">
        <button
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-l cursor-pointer pagination-left "
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </button>

        <div className="flex rounded pagination-pages">{renderPageNumbers()}</div>

        <button
          className="px-3 py-2 rounded-r cursor-pointer pagination-right pagination-left "
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;