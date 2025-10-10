import { Card, Grid, Paper, Typography } from '@mui/material'
import React from 'react'


function OverSummaryCard(props) {
    const {icon,title,text} = props;
    return (
        <Paper elevation={0} square={true} sx={{p: 1}}>
            <Grid container spacing={2}>
                <Grid size={{xs:2,sm:2}} sx={{alignContent:'center'}}>
                    <Typography variant="h6" component="div">
                        {icon}
                    </Typography>
                </Grid>
                <Grid size={{xs:10,sm:10}}>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                    <Typography variant="body1">
                        {text}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default OverSummaryCard
