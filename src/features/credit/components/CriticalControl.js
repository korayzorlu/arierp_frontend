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
        </Block>
    )
}

export default CriticalControl
