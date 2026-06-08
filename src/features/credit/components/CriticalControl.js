import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'
import Block from './Block';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

function CriticalControl(props) {
    return (
        <Block text="Kritik Alan Kontrolü" icon={<TravelExploreIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="ŞİB"
                    checked={props.is_suspicious}
                    onChange={(value) => props.onChangeIsSuspicious(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Yasaklı listesinde"
                    checked={props.is_blacklisted}
                    onChange={(value) => props.onChangeIsBlacklisted(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Offshore bağlantılı yerler"
                    checked={props.is_offshore}
                    onChange={(value) => props.onChangeIsOffshore(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Düşük vergi"
                    checked={props.is_low_tax}
                    onChange={(value) => props.onChangeIsLowTax(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Karmaşık yapı"
                    checked={props.is_complex_structure}
                    onChange={(value) => props.onChangeIsComplexStructure(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Vergi cenneti"
                    checked={props.is_tax_haven}
                    onChange={(value) => props.onChangeIsTaxHaven(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Yaptırım listesine yakın ülkeler"
                    checked={props.is_high_risk_country}
                    onChange={(value) => props.onChangeIsHighRiskCountry(value)}
                    />
                </Grid>
            </Grid>
        </Block>
    )
}

export default CriticalControl
