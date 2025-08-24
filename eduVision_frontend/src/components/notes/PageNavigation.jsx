import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const PageNavigation = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center pb-8">
            <div className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className="p-1 hover:bg-gray-700 rounded"
                    disabled={currentPage === 1}
                    title="Previous Page"
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    className="p-1 hover:bg-gray-700 rounded"
                    title="Search"
                    aria-label="Search"
                >
                    <Search size={16} />
                </button>
                <span className="px-2 text-sm">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className="p-1 hover:bg-gray-700 rounded"
                    disabled={currentPage === totalPages}
                    title="Next Page"
                    aria-label="Next Page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default PageNavigation;
