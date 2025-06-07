import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Grid } from '@mui/material';
import { ReactComponent as EagleIcon2 } from "../../../images/icons/global/eagle.svg";
import { useSelector } from 'react-redux';
import  ctuIcon  from "../../../images/icons/global/ctu-logo.png";
import EagleIcon from '../../../component/icon/EagleIcon';

function Dashboard() {
    const {dark} = useSelector((store) => store.auth);

    return (
        <Stack>
            <Grid
            container
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
                height:'88vh'
            }}
            >
                <Stack
                spacing={2}
                direction="column"
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                    {/* <EagleIcon2 height={120} fill={dark ? "#204E93" : "#204E93"} opacity={1}/> */}
                    {/* <img src={ctuIcon} alt="" height={120} style={{opacity:0.6}}/> */}
                    <EagleIcon sx={{ fontSize: 120, color:"#204E93" }}/>
                    <Typography variant='body1' sx={{color:'text.secondary'}}>
                        Welcome to Marswide
                    </Typography>
                </Stack>
            </Grid>
        </Stack>
    )
}

export default Dashboard
