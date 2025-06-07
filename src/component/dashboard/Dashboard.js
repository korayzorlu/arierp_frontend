import React from 'react'
import { useNavigate} from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate();

  return (
    <div className="row g-0">
        <div className="col-md-12">


            <div>Dashboard</div>
            <button className='btn btn-dark btn-sm' type='button' onClick={()=>navigate(-1)}>Back</button>

        </div>
    </div>
  )
}

export default Dashboard
