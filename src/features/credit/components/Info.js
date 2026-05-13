import { Autocomplete, Button, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import { ArrowOutwardIcon } from 'icons'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Info(props) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/partners/update/${props.partner.id}`);
    }

    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Typography>
                    Partner Bilgileri 
                    <Button
                    onClick={handleNavigate}
                    size='small'
                    variant='text'
                    color='primary'
                    endIcon={<ArrowOutwardIcon />}
                    >
                        Profile Git
                    </Button>
                </Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            İsim
                        </Typography>
                        <Typography>
                            {props.partner.name}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            TC/VKN No
                        </Typography>
                        <Typography>
                            {props.partner.tc_vkn_no}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            Müşteri Kodu
                        </Typography>
                        <Typography>
                            {props.partner.customer_code}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            CRM Kodu
                        </Typography>
                        <Typography>
                            {props.partner.crm_code}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default Info
