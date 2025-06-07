import { Outlet } from "react-router-dom";
import { Grid } from '@mui/material';

function AuthSettings(props) {
    
    return ( 
        <Grid container spacing={2}>
            <Grid size={12}>
                <Outlet/>
            </Grid>
        </Grid>
    );
}

export default AuthSettings;