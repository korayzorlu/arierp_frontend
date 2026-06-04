import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import React, { useState } from 'react'
import WorkIcon from '@mui/icons-material/Work';
import Title from './Title';
import Block from './Block';

function Jobs(props) {
    return (
        <Block text="Meslek" icon={<WorkIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <SgkJobSelect
                    label="Meslek"
                    emptyValue={true}
                    value={props.sgk_job}
                    onChange={(value) => props.onChangeSgkJob(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Çalışma Alanı
                        </InputLabel>
                        <Select
                        value={props.institution}
                        onChange={(event) => props.onChangeInstitution(event.target.value)}
                        label="Çalışma Alanı"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="ozel">Özel Sektör</MenuItem>
                            <MenuItem value="kamu">Kamu Kurumu</MenuItem>
                            <MenuItem value="emekli">Emekli</MenuItem>
                            <MenuItem value="ogrenci">Öğrenci</MenuItem>
                            <MenuItem value="ev">Ev Hanımı</MenuItem>
                            <MenuItem value="issiz">İşsiz</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-is-admin-label" shrink>
                            Çalışma Şekli
                        </InputLabel>
                        <Select
                        value={props.position}
                        onChange={(event) => props.onChangePosition(event.target.value)}
                        label="Çalışma Şekli"
                        inputProps={{ sx: { fontSize: 14 } }}
                        notched
                        fullWidth
                        size='small'
                        >
                            <MenuItem value="calisan">Çalışan</MenuItem>
                            <MenuItem value="yonetici">Yönetici</MenuItem>
                            <MenuItem value="ortak">Ortak</MenuItem>
                            <MenuItem value="firma_sahibi">Firma Sahibi</MenuItem>
                            <MenuItem value="issiz">İşsiz</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Block>
    )
}

export default Jobs
