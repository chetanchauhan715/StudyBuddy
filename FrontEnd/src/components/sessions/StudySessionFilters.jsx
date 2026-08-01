import "./StudySessionFilters.css";

function StudySessionFilters( {subjectOptions , statusOptions, sortOptions , search , setSearch , status , setStatus, subject , setSubject, sort , setSort}){

    return (
        <section className="filters-container">

            <div className="search-bar">
                <input 
                type="text"
                 placeholder="Search.."
                 value={search}
                 onChange={ (e)=> setSearch(e.target.value)}
                 />
            </div>


            <div className="filter-bar">
            <select 
            value={status}
            onChange={ (e)=> setStatus(e.target.value)}
            >
                {statusOptions.map( (status) => (
                    <option 
                    key={status}
                    value={status} >
                        {status}
                    </option>
                ))}
            </select>

            <select 
            value={subject}
            onChange={ (e)=> setSubject(e.target.value)}
            >
                <option value="All Subjects">All Subjects</option>

                {subjectOptions.map( (subject) => (

                    <option
                     key={subject._id}
                     value={subject._id}
                    >
                        {subject.name}

                    </option>
                ))}
            </select>

            <select 
            value={sort.label}
            onChange={ (e) => {
                const selectedSort = sortOptions.find( (option)=> {
                    return option.label === e.target.value;
                });
                setSort(selectedSort);
            }}
            >
                {sortOptions.map( (sorting) => (
                    <option 
                    key={sorting.label}
                    >{sorting.label}</option>
                ))}
            </select>
            </div>



        </section>
    )
}

export default StudySessionFilters;