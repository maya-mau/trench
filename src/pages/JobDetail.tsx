import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from "react-router-dom";
import Spinner from '../components/Spinner.tsx';

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

const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;
const ADZUNA_API_ID = import.meta.env.VITE_ADZUNA_API_ID;

const jobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { company } = useParams<{ company: string }>();
    const locationRouter = useLocation();

    console.log("location", locationRouter);

    const [job, setJob] = useState<Job | null>(locationRouter?.state?.job || null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect( () => {
        if (!job && id) {
 
            const fetchJob = async () => {

                setIsLoading(true);
                setErrorMessage('');

                try {
                    const adzuna_response = await fetch(`/api/jobs/us/search/1?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=10000&what=software%20${encodeURIComponent(company || '')}`);
                    if(!adzuna_response.ok) throw new Error(`Failed to fetch job id ${id} data.`);
                    const data = await adzuna_response.json();

                    console.log("data", data);

                    if(data.Response === 'False') {
                        setErrorMessage(data.Error || 'Failed to fetch job data.');
                        setJob(null);
                        return;
                    }

                    const jobFound = data.results.find( (j: Job) => j.id == id );
                    setJob(jobFound || null);

                } catch (error) {
                    console.error(`Error fetching job data: ${error}`);
                    setErrorMessage('Error fetching job data. Please try again later.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchJob();
        } 
    }, [id, job])

    console.log("job", job);

    if (!job) return <div>Job {id} not found, please try again later.</div>;

    const {title, company: company_object, location, created, contract_time, salary_min, salary_max, salary_is_predicted, redirect_url} = job;

    return (
        
        <div className="wrapper">
            <header> 
                <img className="mb-[50px]" src={`${import.meta.env.BASE_URL}top-banner-trench.png`} alt="Job Search banner"/>
            </header>

            <h2>{title}</h2>
            
            <h3>{company}</h3>
            <p>${salary_min.toLocaleString()}-${salary_max.toLocaleString()}</p>
            <a href={redirect_url} className="px-4 py-2 w-33 bg-sage text-white rounded">
                learn more
            </a>

            
        </div>
    );
};

export default jobDetail;