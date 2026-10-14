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
                            <MenuItem value="10m_less">10 Milyon TL'den az</MenuItem>
                            <MenuItem value="10m_15m">10 Milyon - 15 Milyon TL</MenuItem>
                            <MenuItem value="15m_above">15 Milyon TL'den fazla</MenuItem>
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
                            <MenuItem value="3_less">3'ten az</MenuItem>
                            <MenuItem value="3_5">3-5</MenuItem>
                            <MenuItem value="5_above">5'ten fazla</MenuItem>
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
