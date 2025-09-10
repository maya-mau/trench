import React from 'react'

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

const JobCard: React.FC<JobCardProps> = ( {job: 
    { title, company, location, created, contract_time, salary_min, salary_max, salary_is_predicted}
}) => {

    const guessedDomain = company.display_name.replace(/\s+/g, "").toLowerCase() + ".com";

    // Logo.dev URL (with fallback to a default image)
    const logoUrl = `https://img.logo.dev/${guessedDomain}?token=${import.meta.env.VITE_LOGO_API_KEY}&size=400`;

    return (
        <div className="job-card">
            <img
                src={logoUrl}
                alt={`${company.display_name} logo`}
                className="h-20 w-20 rounded-lg object-contain bg-white"
                onError={ (event) => { // fallback if logo doesn’t exist
                    (event.currentTarget as HTMLImageElement).src = "/default-company.png";
                } }
            />

            
            <div>
                <h3 className="mb-2">{title}</h3>

                <hr></hr>

                <div className="content">
                    <p className="location">{location.area[1]}</p>
                    <span> • </span>

                    {contract_time && (
                        <>
                            <p className="contract_time">{contract_time.split('_').join('-')}
                            </p><span> • </span>
                        </>
                    )}
                    {salary_min && salary_max && (
                        <>
                            <p>{salary_min === salary_max 
                                ? `$${salary_min.toLocaleString()}` 
                                : `$${salary_min.toLocaleString()} - $${salary_max.toLocaleString()}`}
                            </p>
                        </>
                    )}
                    
                </div>
            </div>

        </div>
        
    )
}

export default JobCard