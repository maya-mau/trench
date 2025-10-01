import React from 'react'
import { Link } from 'react-router-dom';

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

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ( {job, job: 
    { id, title, company, location, contract_time, salary_min, salary_max }
}) => {

    const guessedDomain = company.display_name.replace(/\s+/g, "").toLowerCase() + ".com";

    // Logo.dev URL (with fallback to a default image)
    const logoUrl = `https://img.logo.dev/${guessedDomain}?token=${import.meta.env.VITE_LOGO_API_KEY}&size=400`;

    return ( 
        <Link 
            to={`/job/${company.display_name}/${id}`} 
            state={{job}}
            className="block"
        >
            <div className="job-card">
                <div className="header">
                    <img
                        src={logoUrl}
                        alt={`${company.display_name} logo`}
                        className="mr-2 mb-2 h-22 w-22 rounded-lg object-contain bg-white"
                        onError={ (event) => { // fallback if logo doesn’t exist
                            (event.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}default-company.png`;
                        } }
                    />

                    <div>
                        <h3 className="mb-2 line-clamp-2">{title}</h3>
                        <hr></hr>
                        <h3 className=" line-clamp-1">{company.display_name}</h3>
                    </div>

                </div>
                
                <div className="content">

                    <p className="location">{location.area[1]}</p>

                    {contract_time && (
                        <>
                            <span> • </span>
                            <p className="contract_time">{contract_time.split('_').join('-')}</p>
                        </>
                    )}
                    {salary_min && salary_max && (
                        <>
                            <span> • </span>
                            <p>{salary_min === salary_max 
                                ? `$${salary_min.toLocaleString()}` 
                                : `$${salary_min.toLocaleString()} - $${salary_max.toLocaleString()}`}
                            </p>
                        </>
                    )}
                    
                </div>

            </div>
        
        </Link>
        
        
    )
}

export default JobCard