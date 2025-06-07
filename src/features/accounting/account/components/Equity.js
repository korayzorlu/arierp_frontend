import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReceivableAccounts } from '../../../../store/slices/accounting/accountSlice';
import { Grid } from '@mui/material';
import { Paper, Stack } from '@mui/material';
import AccountButton from './AccountButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function Equity() {
    const {dark} = useSelector((store) => store.auth);
    const {mobile} = useSelector((store) => store.sidebar);
    const {activeCompany} = useSelector((store) => store.organization);
    const {receivableAccounts,receivableAccountsCount,receivableAccountsParams,receivableAccountsLoading} = useSelector((store) => store.account);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchReceivableAccounts({activeCompany,params:receivableAccountsParams}))
    }, [activeCompany,receivableAccountsParams,dispatch]);


    return (
        <Paper elevation={0} square>
            <Stack spacing={2}>
                <Grid container spacing={{xs:2,sm:6}} sx={{padding:mobile ? 2 : 6}}>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Capital'
                        link='/accounts/capital'
                        icon={<AccountBalanceWalletIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents initial and additional funds invested by owners.'
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    )
}

export default Equity
