import React from 'react'
import Row from '../../../component/grid/Row';
import Col from '../../../component/grid/Col';
import { Stack, TextField } from '@mui/material';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import { Grid } from '@mui/material';

function InformationTab(props) {
    const {
        valueName,
        valueFormalName,
        valueVatOffice,
        valueAbout,
        valueVatNo,
        onChangeName,
        onChangeFormalName,
        onChangeVatOffice,
        onChangeAbout,
        onChangeVatNo,
        disabled
    } = props;

    return (
        <Stack spacing={2}> 
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Name * "}
                    variant='outlined'
                    value={valueName}
                    onChange={(e) => onChangeName(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Formal Name * "}
                    variant='outlined'
                    value={valueFormalName}
                    onChange={(e) => onChangeFormalName(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Vat Office"}
                    variant='outlined'
                    value={valueVatOffice}
                    onChange={(e) => onChangeVatOffice(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <TextField
                    type="text"
                    size="small"
                    label={"Vat No"}
                    variant='outlined'
                    value={valueVatNo}
                    onChange={(e) => onChangeVatNo(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <TextField
                    type="text"
                    size="small"
                    multiline
                    rows={8}
                    label={"About"}
                    variant='outlined'
                    value={valueAbout}
                    onChange={(e) => onChangeAbout(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default InformationTab
