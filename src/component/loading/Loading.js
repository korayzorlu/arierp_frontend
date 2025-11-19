import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function Loading() {
    const {dark,logo} = useSelector((store) => store.auth);

    return ( 
        <div className="row w-100 vh-100">
            <div className="col-md-12 text-center d-flex justify-content-center align-items-center">

                {/* <img src={require(`../../images/logo/${theme}/ari-logo-full.png`)} height="120" alt=""/> */}
                <Typography className="archivo-black-regular" variant="h1" sx={{color: dark ? '#fff' : '#000'}}>ARINET</Typography>

            </div>
        </div>
     );
}

export default Loading;