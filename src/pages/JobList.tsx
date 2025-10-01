import { useEffect, useState } from 'react';
import Search from '../components/Search.tsx';
import Spinner from '../components/Spinner.tsx';
import JobCard from '../components/JobCard.tsx';
import { useDebounce } from 'react-use';

const ADZUNA_API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    //Authorization: `Bearer ${ADZUNA_API_KEY}`
  }
} 


interface Job {
  title: string;
  id: string;
  company: {
    display_name: string;
  }
  contract_time: string;
  created: string;
  description: string;
  location: {
    area: string[];
    display_name: string;
  }
  redirect_url: string;
  salary_is_predicted: string;
  salary_max: number;
  salary_min: number;
}

const RESULTS_PER_PAGE = 20;

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [jobList, setJobList] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm] )

  const fetchJobs = async (query = "", page: number) => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const adzuna_endpoint = query
        ? `/api/jobs/us/search/${page}?what=${encodeURIComponent(query)}`
        : `/api/jobs/us/search/${page}`; 

      console.log("➡️ Fetching:", adzuna_endpoint);
      const adzuna_response = await fetch(adzuna_endpoint, ADZUNA_API_OPTIONS);
      //const text = await adzuna_response.text();
      //console.log("Adzuna response:", text);
    
      if(!adzuna_response.ok) {
        throw new Error('Failed to fetch job data.');
      }

      const data = await adzuna_response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch job data.');
        setJobList([]);
        return;
      }

      //console.log(data);

      setJobList(data.results || []);

      if (data.count) {
        setTotalPages(Math.ceil(data.count / RESULTS_PER_PAGE))
      }

    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      setErrorMessage('Error fetching data. Please try again later.');
    
    } finally {
      setIsLoading(false);
    }
  }

  useEffect( () => {
    fetchJobs(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page]); // dependencies array

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page]);

  return (
    <main>

      <div className="wrapper">
        
        <header> 
          <img className="mb-[50px]" src={`${import.meta.env.BASE_URL}top-banner-trench.png`} alt="Job Search banner"/>
          <h1>Discover <span className="text-gradient">tech jobs</span>, trends, and more.</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className="all-jobs"> 
          <h2 className="mt-[40px]">All Jobs</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {jobList.map( (job) => (
                <JobCard key={job.id} job={job} />
              ) )}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="h-8 px-4 text-sm bg-sage text-white rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          previous
        </button>

        {Array.from( {length: totalPages}, (_, i) => i + 1 )
          .filter( // always show...
            (p) => 
              p === 1 || // first page
              p === totalPages || // last page
              p >= page - 2 && p <= page + 2 // window of 5 around curr page
          )
          .map((p, i, arr) => {
            const prev = arr[i - 1];
            const showEllipsis = prev && p - prev > 1; // boolean

            return (
              <span key={p}>
                {showEllipsis && <span className="pr-4">...</span>}
                <button
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-gray-400 text-gray-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              </span>
            );
          })
        }
          
        <button
          className="h-8 px-4 text-sm bg-sage text-white rounded"
          onClick={() => setPage((p) => p + 1)}
        >
          next
        </button>

      </div>
    </main>
  )
}

export default JobList