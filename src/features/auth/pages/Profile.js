import { useEffect } from "react";
import { Input } from "mdb-ui-kit";
import { useSelector } from "react-redux";

function Profile() {
    const {user} = useSelector((store) => store.auth);

    useEffect(() => {
            //mdb input
            const inputs = document.querySelectorAll('.form-outline');
            inputs.forEach((input) => {
                new Input(input); // Her dropdown öğesini başlat
            });
    
    }, []);


    return ( 
        <div className="row g-0">
            <div className="col-md-3">

                <div className="card">
                    <div className="card-header">
                        <h5>Profile</h5>
                    </div>
                    <div className="card-body">
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                    </div>
                </div>

            </div>
        </div>
     );
}

export default Profile;