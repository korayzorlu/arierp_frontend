import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'
import Block from './Block';
import { InfoIcon } from 'icons';

function CustomerInfo(props) {
    return (
        <Block text="Müşteri Bilgileri" icon={<InfoIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Müşteri Tipi
                        </InputLabel>
                        <Select
                        value={props.customer_type}
                        onChange={(event) => props.onChangeCustomerType(event.target.value)}
                        label="Müşteri Tipi"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        displayEmpty
                        disabled
                        >
                            <MenuItem value="bireysel">Bireysel</MenuItem>
                            <MenuItem value="tuzel">Tüzel</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {
                props.customer_type === 'tuzel'
                ?
                    <>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:12}}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel id="select-is-admin-label" shrink>
                                        Şirket Türü
                                    </InputLabel>
                                    <Select
                                    value={props.company_type}
                                    onChange={(event) => props.onChangeCompanyType(event.target.value)}
                                    label="Şirket Türü"
                                    inputProps={{ sx: { fontSize: 14 } }}
                                    notched
                                    fullWidth
                                    size='small'
                                    displayEmpty
                                    >
                                        <MenuItem value="as">A.Ş.</MenuItem>
                                        <MenuItem value="ltd">Ltd.</MenuItem>
                                        <MenuItem value="sahis">Şahıs Şirketi</MenuItem>
                                        <MenuItem value="kollektif">Kollektif Şirket</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:12}}>
                                <AndroidSwitch
                                label="Şeffaf"
                                checked={props.is_transparency}
                                onChange={(value) => props.onChangeIsTransparency(value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:12}}>
                                <AndroidSwitch
                                label="Yabancı Ortaklı"
                                checked={props.is_foreign_partner}
                                onChange={(value) => props.onChangeIsForeignPartner(value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:12}}>
                                <AndroidSwitch
                                label="Çok Ortaklı Karmaşık"
                                checked={props.is_complex_partner}
                                onChange={(value) => props.onChangeIsComplexPartner(value)}
                                />
                            </Grid>
                        </Grid>
                    </>
                :
                    null
            }
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Yabancı Uyruklu"
                    checked={props.is_foreign_nationality}
                    onChange={(value) => props.onChangeIsForeignNationality(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Nihai Faydalanıcı"
                    checked={props.is_end_beneficiary}
                    onChange={(value) => props.onChangeIsEndBeneficiary(value)}
                    />
                </Grid>
            </Grid>
        </Block>
    )
}

export default CustomerInfo
