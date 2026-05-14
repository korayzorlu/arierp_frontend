import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import React, { useState } from 'react'
import Block from './Block';
import FindInPageIcon from '@mui/icons-material/FindInPage';

function Transactions(props) {
    return (
        <Block text="İşlem Davranışı" icon={<FindInPageIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Ortalama İşlem Tutarı
                        </InputLabel>
                        <Select
                        value={props.transaction_amount}
                        onChange={(event) => props.onChangeTransactionAmount(event.target.value)}
                        label="Ortalama İşlem Tutarı"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="0">0,00 TRY</MenuItem>
                            <MenuItem value="1">1,00 - 100.000,00 TRY</MenuItem>
                            <MenuItem value="2">100.001,00 - 500.000,00 TRY</MenuItem>
                            <MenuItem value="3">500.001,00 - 2.000.000,00 TRY</MenuItem>
                            <MenuItem value="4">2.000.001,00 - 10.000.000,00 TRY</MenuItem>
                            <MenuItem value="5">10.000.001,00+ TRY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            İşlem Sıklığı
                        </InputLabel>
                        <Select
                        value={props.transaction_frequency}
                        onChange={(event) => props.onChangeTransactionFrequency(event.target.value)}
                        label="İşlem Sıklığı"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="0">0</MenuItem>
                            <MenuItem value="1">1-20</MenuItem>
                            <MenuItem value="2">21-50</MenuItem>
                            <MenuItem value="3">51-100</MenuItem>
                            <MenuItem value="4">101-500</MenuItem>
                            <MenuItem value="5">500+</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Gelir & İşlem Uyumu
                        </InputLabel>
                        <Select
                        value={props.transaction_risk}
                        onChange={(event) => props.onChangeTransactionRisk(event.target.value)}
                        label="Gelir & İşlem Uyumu"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        displayEmpty
                        >
                            <MenuItem value="riskli">Riskli</MenuItem>
                            <MenuItem value="riskli_degil">Riskli Değil</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Gelir & Meslek Uyumu
                        </InputLabel>
                        <Select
                        value={props.job_compliance}
                        onChange={(event) => props.onChangeJobCompliance(event.target.value)}
                        label="Gelir & Meslek Uyumu"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        displayEmpty
                        >
                            <MenuItem value="uyumlu">Uyumlu</MenuItem>
                            <MenuItem value="uyumlu_degil">Uyumlu Değil</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Block>
    )
}

export default Transactions
