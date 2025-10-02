interface ComponentProps { 
    searchTerm: string;
    setSearchTerm: Function; 
}

const Search = ( {searchTerm, setSearchTerm}: ComponentProps ) => {
    return (
        <div className="search">
            <div>
                <img src={`${import.meta.env.BASE_URL}search.svg`} alt="search icon"/>
                <input 
                    type="text"
                    placeholder="Search through thousands of jobs"
                    value={searchTerm}
                    onChange={ (event) => setSearchTerm(event.target.value) }
                />
            </div>
        </div>
    )
}

export default Search