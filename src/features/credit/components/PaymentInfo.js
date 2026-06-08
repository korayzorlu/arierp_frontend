import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'
import Block from './Block';
import PaymentsIcon from '@mui/icons-material/Payments';

function PaymentInfo(props) {
    return (
        <Block text="Ödeme Davranışı" icon={<PaymentsIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Ödeme Yöntemi
                        </InputLabel>
                        <Select
                        value={props.remitter_type}
                        onChange={(event) => props.onChangeRemitterType(event.target.value)}
                        label="Ödeme Yöntemi"
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
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Sanal Pos Ödemesi
                        </InputLabel>
                        <Select
                        value={props.vpos_type}
                        onChange={(event) => props.onChangeVposType(event.target.value)}
                        label="Sanal Pos Ödemesi"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="kendisi">Kendisi</MenuItem>
                            <MenuItem value="yakini">Yakını (Aile Bağı)</MenuItem>
                            <MenuItem value="ucuncu_kisi">3. Kişi</MenuItem>
                            <MenuItem value="yok">Sanal Pos Yok</MenuItem>
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
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Kurum Ödemesi"
                    checked={props.is_institutional_payment}
                    onChange={(value) => props.onChangeIsInstitutionalPayment(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Muhabir Banka"
                    checked={props.is_correspondent_bank}
                    onChange={(value) => props.onChangeIsCorrespondentBank(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Ödeme Kuruluşu"
                    checked={props.is_payment_institution}
                    onChange={(value) => props.onChangeIsPaymentInstitution(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Çek/Senet Ödemesi"
                    checked={props.is_cek_senet_payment}
                    onChange={(value) => props.onChangeIsCekSenetPayment(value)}
                    />
                </Grid>
            </Grid>
        </Block>
    )
}

export default PaymentInfo
