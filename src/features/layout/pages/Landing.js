import { Outlet } from "react-router-dom";
import NavbarLanding from "../../../component/navbar/NavbarLanding";

function Landing() {
    return ( 
        <>
            <NavbarLanding></NavbarLanding>

            <div className='row homeContent p-0 m-0 w-100'>
                <div className='col p-0 m-0 h-100 pageContent overflow-scroll'>
                    <div className="row p-2 m-0">
                        <div className="col-md-12">

                        <Outlet/>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;