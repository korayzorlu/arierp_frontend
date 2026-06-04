import { Autocomplete, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import React, { useState } from 'react'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Title from './Title';
import Block from './Block';
import NumberField from 'component/input/NumberField';

function formatAmount(raw) {
    if (raw === '' || raw === null || raw === undefined) return '';
    const parts = String(raw).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.length > 1 ? `${intPart},${parts[1]}` : intPart;
}

function Assets(props) {
    return (
        <Block text="Varlıklar" icon={<AccountBalanceIcon />}> 
            {/* <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <NumberField
                    label="Taşınmazlar (Adet)"
                    size="small"
                    min={0}
                    max={9999}
                    value={props.real_estate_assets_count}
                    onChange={(e) => props.onChangeRealEstateAssetsCount(e.target.value ? e.target.value : 0)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <NumberField
                    label="Araçlar (Adet)"
                    size="small"
                    min={0}
                    max={9999}
                    value={props.vehicle_assets_count}
                    onChange={(e) => props.onChangeVehicleAssetsCount(e.target.value ? e.target.value : 0)}
                    />
                </Grid>
            </Grid> */}
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Taşınmazlar
                        </InputLabel>
                        <Select
                        value={props.real_estate_assets}
                        onChange={(event) => props.onChangeRealEstateAssets(event.target.value)}
                        label="Taşınmazlar"
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
                            Taşıtlar
                        </InputLabel>
                        <Select
                        value={props.vehicle_assets}
                        onChange={(event) => props.onChangeVehicleAssets(event.target.value)}
                        label="Taşıtlar"
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
                            Banka Mevduatı
                        </InputLabel>
                        <Select
                        value={props.bank_deposit_assets}
                        onChange={(event) => props.onChangeBankDepositAssets(event.target.value)}
                        label="Banka Mevduatı"
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
                            Yatırım Varlıkları
                        </InputLabel>
                        <Select
                        value={props.investment_assets}
                        onChange={(event) => props.onChangeInvestmentAssets(event.target.value)}
                        label="Yatırım Varlıkları"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="0">0,00 TRY</MenuItem>
                            <MenuItem value="1">1,00 - 500.000,00 TRY</MenuItem>
                            <MenuItem value="2">500.001,00 - 1.000.000,00 TRY</MenuItem>
                            <MenuItem value="3">1.000.001,00 - 5.000.000,00 TRY</MenuItem>
                            <MenuItem value="4">5.000.001,00 - 15.000.000,00 TRY</MenuItem>
                            <MenuItem value="5">15.000.001,00+ TRY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Diğer Varlıklar"}
                    variant='outlined'
                    value={formatAmount(props.other_assets_amount)}
                    onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^\d,]/g, '');
                        const parts = cleaned.split(',');
                        if (parts.length > 2) return;
                        const raw = parts.length === 2 ? `${parts[0]}.${parts[1]}` : parts[0];
                        props.onChangeOtherAssetsAmount(raw);
                    }}
                    fullWidth
                    />
                </Grid>
            </Grid>
            <Grid size={{xs:12,sm:12}}>
                <FormControl component="fieldset" variant="standard" fullWidth>
                    <FormLabel component="legend">Diğer Varlık Bilgileri</FormLabel>
                    <FormGroup>
                        <TextField
                        type="text"
                        size="small"
                        variant='outlined'
                        value={props.other_assets_description}
                        onChange={(e) => props.onChangeOtherAssetsDescription(e.target.value)}
                        disabled={props.other_assets_amount > 0 ? false : true}
                        multiline
                        rows={3}
                        fullWidth
                        />
                    </FormGroup>
                </FormControl>
                
            </Grid>
        </Block>
    )
}

export default Assets
