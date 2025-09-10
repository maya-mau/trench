import React, { useEffect, useState } from 'react';
import Search from './components/Search.tsx';
import Spinner from './components/Spinner.tsx';
import JobCard from './components/JobCard.tsx';

// https://api.adzuna.com/v1

const ADZUNA_API_BASE_URL = '/api';
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;
const ADZUNA_API_ID = import.meta.env.VITE_ADZUNA_API_ID;
const ADZUNA_API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ADZUNA_API_KEY}`
  }
}

const LOGO_API_BASE_URL = '/api';
const LOGO_API_KEY = import.meta.env.VITE_LOGO_API_KEY;
const LOGO_API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${LOGO_API_KEY}`
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


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [jobList, setJobList] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchJobs = async (query = "") => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const adzuna_endpoint = query
        ? `${ADZUNA_API_BASE_URL}/jobs/us/search/1?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(query)}`
        : `${ADZUNA_API_BASE_URL}/jobs/us/search/1?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=20&sort_by=relevance&what=software`;
      const adzuna_response = await fetch(adzuna_endpoint, ADZUNA_API_OPTIONS);
    
      if(!adzuna_response.ok) {
        throw new Error('Failed to fetch job data.');
      }

      const data = await adzuna_response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch job data.');
        setJobList([]);
        return;
      }

      console.log(data);

      setJobList(data.results || []);

    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      setErrorMessage('Error fetching data. Please try again later.');
    
    } finally {
      setIsLoading(false);
    }
  }

  useEffect( () => {
    fetchJobs(searchTerm);
  }, [searchTerm]); // dependencies array

  return (
    <main>

      <div className="pattern" />

      <div className="wrapper">
        
        <header> 
          <img src="./top-banner.png" alt="Job Search banner"/>
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
    </main>
  )
}

export default App