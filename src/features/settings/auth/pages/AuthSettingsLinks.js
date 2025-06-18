import { Button, Divider, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function AuthSettingsLinks() {
    const navigate = useNavigate();
    
    return ( 
        <Stack spacing={0}>  
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    onClick={() => navigate("/settings/auth/profile")}
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        Profil
                    </Button>
                    <Divider></Divider>
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    component={Link}
                    to="/settings/auth/personal"
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        Kişisel
                    </Button>
                    <Divider></Divider>
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    component={Link}
                    to="/settings/auth/email"
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        E-posta
                    </Button>
                    <Divider></Divider>
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    component={Link}
                    to="/settings/auth/phone-number"
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        Telefon
                    </Button>
                    <Divider></Divider>
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    component={Link}
                    to="/settings/auth/password-reset"
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        Parola Sıfırlama
                    </Button>
                </Grid>
            </Grid>
        </Stack>    
    );
}

export default AuthSettingsLinks;