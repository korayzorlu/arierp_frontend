import { Chip, Divider, Grid, IconButton, Paper, Stack } from '@mui/material'
import React from 'react'
import Title from './Title'

function Block(props) {
    return (
        <Paper elevation={0} sx={{p:2,height:'100%'}} square>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={{xs:6,sm:6}}>
                        <Title text={props.text} icon={props.icon} />
                    </Grid>
                    <Grid size={{xs:6,sm:4}} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}} offset={{xs:0,sm:'auto'}}>
                        {
                            props.rightButton
                            ?
                                <IconButton
                                color='opposite'
                                size='small'
                                onClick={props.rightButton.onClick}
                                >
                                    {props.rightButton.icon}
                                </IconButton>
                            :
                                null
                        }
                        <Chip variant='contained' color={props.chipColor} label={props.chipLabel} size='small'/>
                    </Grid>
                    
                </Grid>
                {
                    !props.noDivider && <Divider />
                }
                {props.children}
            </Stack>
        </Paper>
    )
}

export default Block
