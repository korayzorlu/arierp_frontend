import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import React, { useState } from 'react'

function Assets(props) {
    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Typography>
                    Varlıklar
                </Typography>
            </Grid>
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
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Araçlar
                        </InputLabel>
                        <Select
                        value={props.vehicle_assets}
                        onChange={(event) => props.onChangeVehicleAssets(event.target.value)}
                        label="Araçlar"
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
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Diğer Varlıklar
                        </InputLabel>
                        <Select
                        value={props.other_assets}
                        onChange={(event) => props.onChangeOtherAssets(event.target.value)}
                        label="Diğer Varlıklar"
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
        </Stack>
    )
}

export default Assets
