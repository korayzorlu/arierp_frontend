import { Divider, Grid, Stack } from '@mui/material'
import React from 'react'
import Title from './Title'

function Block(props) {
  return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                <Title text={props.text} icon={props.icon} />
            </Grid>
            {
                !props.noDivider && <Divider />
            }
            {props.children}
        </Stack>
    )
}

export default Block
