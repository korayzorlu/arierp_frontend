import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'

function PaymentInfo(props) {
    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Typography>
                    Ödeme Davranışı
                </Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            3. Kişi Kullanımı
                        </InputLabel>
                        <Select
                        value={props.remitter_type}
                        onChange={(event) => props.onChangeRemitterType(event.target.value)}
                        label="3. Kişi Kullanımı"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="kendisi">Kendisi</MenuItem>
                            <MenuItem value="yakini">Yakını (Aile Bağı)</MenuItem>
                            <MenuItem value="ucuncu_kisi">3. Kişi</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Nakit Ödeme"
                    checked={props.is_cash_payment}
                    onChange={(value) => props.onChangeIsCashPayment(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Balon Ödeme"
                    checked={props.is_balloon_payment}
                    onChange={(value) => props.onChangeIsBalloonPayment(value)}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default PaymentInfo
