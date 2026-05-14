import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'
import Block from './Block';
import PolicyIcon from '@mui/icons-material/Policy';

function PepControl(props) {
    return (
        <Block text="PEP ve İtibar Kontrolü" icon={<PolicyIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Pep grubu mu?"
                    checked={props.is_pep}
                    onChange={(value) => props.onChangeIsPep(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Olumsuz haber var mı?"
                    checked={props.is_negative_news}
                    onChange={(value) => props.onChangeIsNegativeNews(value)}
                    />
                </Grid>
            </Grid>
    </Block>
    )
}

export default PepControl
