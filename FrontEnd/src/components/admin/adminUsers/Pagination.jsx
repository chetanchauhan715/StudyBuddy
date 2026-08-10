function Pagination({ pagination, onPageChange }) {
    if (!pagination) return null;

    const {
        currentPage,
        totalPages,
        hasNext,
        hasPrev,
    } = pagination;

    return (
        <div className="pagination">

            <button
                disabled={!hasPrev}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                disabled={!hasNext}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;