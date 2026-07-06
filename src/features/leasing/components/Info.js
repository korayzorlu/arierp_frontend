import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallmentsInLease } from 'store/slices/leasing/leaseSlice';
import BasicTable from 'component/table/BasicTable';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import { fetchInstallmentInformation } from 'store/slices/leasing/installmentSlice';
import { useGridApiRef } from '@mui/x-data-grid-premium';

function Info(props) {

    return (
         <>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Kira Planı Kodu"}
                        variant='outlined'
                        value={props.data.code}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Sözleşme No"}
                        variant='outlined'
                        value={props.data.contract}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri"}
                        variant='outlined'
                        value={props.data.partner}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri TC/VKN"}
                        variant='outlined'
                        value={props.data.partner_tc}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:6}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Proje"}
                        variant='outlined'
                        value={props.data.item ? props.data.item.name : ""}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Blok"}
                        variant='outlined'
                        value={props.data.block}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Bağımsız Bölüm"}
                        variant='outlined'
                        value={props.data.unit}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Vade"}
                        variant='outlined'
                        value={props.data.vade}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri Baz Maliyet"}
                        variant='outlined'
                        value={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.musteri_baz_maliyet)}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"IRR"}
                        variant='outlined'
                        value={props.data.irr}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Para Birimi"}
                        variant='outlined'
                        value={props.data.currency}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Finansman Kurum"}
                        variant='outlined'
                        value={props.data.finansman_kurum}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Aktifleştirilme Tarihi"}
                        variant='outlined'
                        value={props.data.activation_date}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Statü 1"}
                        variant='outlined'
                        value={props.data.lease_status}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Statü 2"}
                        variant='outlined'
                        value={props.data.status}
                        disabled={false}
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}

export default Info
