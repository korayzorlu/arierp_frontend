import { Grid, Typography } from '@mui/material'
import React from 'react'

function LabelValueText({...props}) {
    return (
        <Grid container spacing={0}>
            <Grid size={{xs:4,sm:3}}>
                <Typography color={props.labelColor || 'primary'}>
                    {props.label}
                </Typography>
            </Grid>
            <Grid size={{xs:8,sm:9}}>
                <Typography>
                    {props.value}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default LabelValueText
