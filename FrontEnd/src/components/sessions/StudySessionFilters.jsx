import "./StudySessionFilters.css";

function StudySessionFilters( {subjectOptions , statusOptions, sortOptions}){
    return (
        <section className="filters-container">

            <div className="search-bar">
                {/* <label htmlFor="">Search ...</label> */}
                <input type="text" placeholder="Search.." />
            </div>

            <div className="filter-bar">
            <select name="" id="">
                {statusOptions.map( (status) => (
                    <option key={status}>{status}</option>
                ))}
            </select>

            <select name="" id="">
                {subjectOptions.map( (subject) => (
                    <option key={subject}>{subject}</option>
                ))}
            </select>

            <select name="" id="">
                {sortOptions.map( (sort) => (
                    <option key={sort}>{sort}</option>
                ))}
            </select>
            </div>



        </section>
    )
}

export default StudySessionFilters;