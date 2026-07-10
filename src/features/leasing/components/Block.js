import { Divider, Grid, Stack, IconButton } from '@mui/material'
import React from 'react'
import Title from './Title'
import { AttachFileRoundedIcon } from 'icons'

function Block(props) {
  return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                <Grid size={{xs:10,sm:10}}>
                    <Title text={props.text} icon={props.icon} color={props.color} />
                </Grid>
                <Grid size={{xs:2,sm:2}} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
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
                </Grid>
                
            </Grid>
            {
                !props.noDivider && <Divider />
            }
            {props.children}
        </Stack>
    )
}

export default Block
