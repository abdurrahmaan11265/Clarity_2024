import { useNavigate } from 'react-router-dom';

function HeaderStudent({header_name}) {
    const navigate = useNavigate();
    const handleGoBack = () => {
    if(header_name === "Student Profile"){
      navigate('/counselor');
    }
    else if(header_name === "Analytics"){
      navigate('/student');
    }
    else{
      navigate(-1);
    }
  };
  
    return (
        <div>
             <header className='header-nav'>
        <div className="nav flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-2" aria-label="Go back" onClick={handleGoBack}>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">{header_name}</h1>
          </div>
        </div>
      </header>

        </div>
    );
}

export default  HeaderStudent;