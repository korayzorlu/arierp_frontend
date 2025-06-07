import { Button, Divider, Stack } from '@mui/material'
import React from 'react'
import { Grid } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function OrganizationSettings() {
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

export default OrganizationSettings
