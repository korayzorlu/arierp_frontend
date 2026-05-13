import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import React, { useState } from 'react'

function Jobs(props) {
    console.log(props.sgk_job)
    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Typography>
                    Meslek
                </Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    <SgkJobSelect
                    label="Meslek"
                    emptyValue={true}
                    value={props.sgk_job}
                    onChange={(value) => props.onChangeSgkJob(value)}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default Jobs
