import React from 'react'
import Row from '../../../component/grid/Row'
import Col from '../../../component/grid/Col'
import { Stack, TextField } from '@mui/material'
import CountrySelect from '../../../component/select/CountrySelect';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import CurrencySelect from '../../../component/select/CurrencySelect';

function ContactTab(props) {
    const {valueEmail,valueWeb,valuePhoneCountry,valuePhoneNumber,onChangeEmail,onChangeWeb,onChangePhoneCountry,onChangePhoneNumber,valueCurrency,onChangeCurrency,disabled} = props;

    return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:3}}>
                    <CountrySelect
                    label="Phone Code"
                    emptyValue={true}
                    value={valuePhoneCountry}
                    onChange={(value) => onChangePhoneCountry(value)}
                    isPhoneCountry={true}
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <TextField
                    size="small"
                    label={"Phone Number"}
                    variant='outlined'
                    value={valuePhoneNumber}
                    onChange={(e) => onChangePhoneNumber(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <TextField
                    type="email"
                    size="small"
                    label={"Email"}
                    variant='outlined'
                    value={valueEmail}
                    onChange={(e) => onChangeEmail(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <TextField
                    type="web"
                    size="small"
                    label={"Web"}
                    variant='outlined'
                    value={valueWeb}
                    onChange={(e) => onChangeWeb(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:3}}>
                    <CurrencySelect
                    label="Currency"
                    emptyValue={true}
                    value={valueCurrency}
                    onChange={(value) => onChangeCurrency(value)}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default ContactTab
