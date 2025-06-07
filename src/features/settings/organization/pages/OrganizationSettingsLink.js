import { Button, Divider, Stack } from '@mui/material';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function OrganizationSettingsLink() {
    const navigate = useNavigate();
    return (
        <Stack spacing={0}>
            <Grid container spacing={0}>
                <Grid size={12}>
                    <Button
                    component={Link}
                    to="/settings/organization/currency"
                    variant="text"
                    endIcon={<ArrowForwardIosIcon/>}
                    sx={{justifyContent:'space-between',height:60}}
                    size="large"
                    fullWidth
                    >
                        Display Currency
                    </Button>
                    <Divider></Divider>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default OrganizationSettingsLink
