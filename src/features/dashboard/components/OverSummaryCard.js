import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
import EditDocumentIcon from '@mui/icons-material/EditDocument';

function OverSummaryCard() {
    return (
        <Card variant="outlined" square={true}>
            <Grid container spacing={2}>
                <Grid size={{xs:4,sm:4}}>
                    <Typography gutterBottom variant="h6" component="div">
                        <EditDocumentIcon fontSize='large'/>
                    </Typography>
                </Grid>
                <Grid size={{xs:8,sm:8}}>
                    <Typography gutterBottom variant="h6" component="div">
                        40 Sözleşme
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    )
}

export default OverSummaryCard
