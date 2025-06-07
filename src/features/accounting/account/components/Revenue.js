import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReceivableAccounts } from '../../../../store/slices/accounting/accountSlice';
import { Paper, Stack } from '@mui/material';
import { Grid } from '@mui/material';
import AccountButton from './AccountButton';
import EqualizerIcon from '@mui/icons-material/Equalizer';

function Revenue() {
    const {mobile} = useSelector((store) => store.sidebar);

    return (
        <Paper elevation={0} square>
            <Stack spacing={2}>
                <Grid container spacing={{xs:2,sm:6}} sx={{padding:mobile ? 2 : 6}}>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Sales'
                        link="/accounts/sales"
                        icon={<EqualizerIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents income from sales or services.'
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    )
}

export default Revenue
