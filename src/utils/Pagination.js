import React from 'react'

function Pagination({ totalRecords, currentPage, recordsLimits, setCurrentPage }) {
    const pages = []
    for (let i = 1; i <= Math.ceil(totalRecords / recordsLimits); i++) {
        pages.push(i)
    }
    return (
        <div className='d-flex justify-content-center align-items-center gap-3'>
            {pages.map((page, index) => {
                return <button className={ `btn ${page == currentPage ? "bg-warning" : "bg-secondary"}`} key={index} onClick={() => setCurrentPage(page)}>{page}</button>
            })}
        </div>
    )
}

export default Pagination
