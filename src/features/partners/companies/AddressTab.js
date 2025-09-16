import React, { useEffect, useState } from 'react'
import Row from '../../../component/grid/Row';
import Col from '../../../component/grid/Col';
import CountrySelect from '../../../component/select/CountrySelect';
import CitySelect from '../../../component/select/CitySelect';
import { Divider, Stack, TextField, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';

function AddressTab(props) {
    const {
        valueCountry,
        valueCity,
        valueAddress,
        valueAddress2,
        onChangeCountry,
        onChangeCity,
        onChangeAddress,
        onChangeAddress2,
        isBillingSame,
        onChangeIsBillingSame,
        valueBillingCountry,
        valueBillingCity,
        valueBillingAddress,
        valueBillingAddress2,
        onChangeBillingCountry,
        onChangeBillingCity,
        onChangeBillingAddress,
        onChangeBillingAddress2,
        valueEmail,
        valueWeb,
        valuePhoneNumber,
        onChangeEmail,
        onChangeWeb,
        onChangePhoneNumber,
        disabled
    } = props;

    return (
        <Stack spacing={2}>

            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    <TextField
                    size="small"
                    label={"Telefon Numarası"}
                    variant='outlined'
                    value={valuePhoneNumber}
                    onChange={(e) => onChangePhoneNumber(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:4}}>
                    <TextField
                    type="email"
                    size="small"
                    label={"E-Posta"}
                    variant='outlined'
                    value={valueEmail}
                    onChange={(e) => onChangeEmail(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    />
                </Grid>
                <Grid size={{xs:12,sm:4}}>
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

            <Typography variant='body1' sx={{textAlign:"left"}}>
                Adres
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    <Stack spacing={2}>
                        <CountrySelect
                        emptyValue={true}
                        value={valueCountry}
                        onChange={(value) => onChangeCountry(value)}
                        />
                        <CitySelect
                        emptyValue={true}
                        value={valueCity}
                        country={valueCountry}
                        onChange={(value) => onChangeCity(value)}
                        />
                    </Stack>
                </Grid>
                <Grid size={{xs:12,sm:8}}>
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        label={"Adres Satırı 1"}
                        variant='outlined'
                        size='small'
                        value={valueAddress}
                        onChange={(e) => onChangeAddress(e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        label={"Adres Satırı 2"}
                        variant='outlined'
                        size='small'
                        value={valueAddress2}
                        onChange={(e) => onChangeAddress2(e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Stack>
                </Grid>
            </Grid>

            <AndroidSwitch
            label="Fatura adresi olarak kullan"
            checked={isBillingSame}
            onChange={(value) => onChangeIsBillingSame(value)}
            />
            
            {
                isBillingSame
                ?
                    <></>
                :
                    <>
                        <Typography variant='body1' sx={{textAlign:"left"}}>
                            Fatura Adresi
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:4}}>
                                <Stack spacing={2}>
                                    <CountrySelect
                                    emptyValue={true}
                                    value={valueBillingCountry}
                                    onChange={(value) => onChangeBillingCountry(value)}
                                    />
                                    <CitySelect
                                    emptyValue={true}
                                    value={valueBillingCity}
                                    country={valueBillingCountry}
                                    onChange={(value) => onChangeBillingCity(value)}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{xs:12,sm:8}}>
                                <Stack spacing={2}>
                                    <TextField
                                    type="text"
                                    label={"Address Line 1"}
                                    variant='outlined'
                                    size='small'
                                    value={valueBillingAddress}
                                    onChange={(e) => onChangeBillingAddress(e.target.value)}
                                    disabled={disabled}
                                    fullWidth
                                    />
                                    <TextField
                                    type="text"
                                    label={"Address Line 2"}
                                    variant='outlined'
                                    size='small'
                                    value={valueBillingAddress2}
                                    onChange={(e) => onChangeBillingAddress2(e.target.value)}
                                    disabled={disabled}
                                    fullWidth
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>

            }
            

        </Stack>
    )
}

export default AddressTab
