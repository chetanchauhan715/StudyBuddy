import "./Pagination.css";

function Pagination({currentPage , totalPages , onPageChange}){
    const pages = [];
    for(let i=1; i<=totalPages; i++){
        pages.push(i);
    }

    return (
        <div className="pagination-container">

    <button
     className="pagination-btn"
     disabled={currentPage===1}
     onClick={ ()=> onPageChange(currentPage-1)}
     >
        ← Prev
    </button>

    <div className="page-numbers">
        {pages.map((page)=>(
            <button
                key={page}
                className={
                    currentPage === page ?
                    "page-btn active":
                    "page-btn"
                }
                onClick={ ()=> onPageChange(page)}
            >
                {page}
            </button>
        ))}
    </div>

    <button
     className="pagination-btn"
     disabled={currentPage===totalPages}
     onClick={ ()=> onPageChange(currentPage + 1)}
     >
        Next →
    </button>

</div>
    )
}



export default Pagination;