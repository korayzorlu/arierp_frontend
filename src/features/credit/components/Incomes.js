import { Grid, Stack, TextField } from '@mui/material'
import React from 'react'

function Incomes(props) {
    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"İsim * "}
                    variant='outlined'
                    value={props.valueName}
                    onChange={(e) => props.onChangeName(e.target.value)}
                    disabled={props.disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Ünvan * "}
                    variant='outlined'
                    value={props.valueFormalName}
                    onChange={(e) => props.onChangeFormalName(e.target.value)}
                    disabled={props.disabled}
                    fullWidth
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default Incomes
