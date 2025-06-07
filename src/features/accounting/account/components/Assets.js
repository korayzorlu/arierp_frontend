import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivableAccounts } from '../../../../store/slices/accounting/accountSlice';
import { Box, Button, Card, Divider, Paper, Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PaidIcon from '@mui/icons-material/Paid';
import AccountButton from './AccountButton';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';

function Assets() {
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
        // <Paper elevation={0} square>
        //     <Stack spacing={0}>  
        //     <Grid container spacing={0}>
        //         <Grid size={12}>
        //             <Button
        //             onClick={() => navigate("/settings/auth/profile")}
        //             variant="text"
        //             endIcon={<ArrowForwardIosIcon/>}
        //             sx={{justifyContent:'space-between',height:60}}
        //             size="large"
        //             fullWidth
        //             >
        //                 Cash
        //             </Button>
        //             <Divider></Divider>
        //         </Grid>
        //     </Grid>
        //     <Grid container spacing={0}>
        //         <Grid size={12}>
        //             <Button
        //             component={Link}
        //             to="/settings/auth/personal"
        //             variant="text"
        //             endIcon={<ArrowForwardIosIcon/>}
        //             sx={{justifyContent:'space-between',height:60}}
        //             size="large"
        //             fullWidth
        //             >
        //                 Bank
        //             </Button>
        //             <Divider></Divider>
        //         </Grid>
        //     </Grid>
        //     <Grid container spacing={0}>
        //         <Grid size={12}>
        //             <Button
        //             component={Link}
        //             to="/settings/auth/email"
        //             variant="text"
        //             endIcon={<ArrowForwardIosIcon/>}
        //             sx={{justifyContent:'space-between',height:60}}
        //             size="large"
        //             fullWidth
        //             >
        //                 Accounts Receivable
        //             </Button>
        //             <Divider></Divider>
        //         </Grid>
        //     </Grid>
        //     <Grid container spacing={0}>
        //         <Grid size={12}>
        //             <Button
        //             component={Link}
        //             to="/settings/auth/phone-number"
        //             variant="text"
        //             endIcon={<ArrowForwardIosIcon/>}
        //             sx={{justifyContent:'space-between',height:60}}
        //             size="large"
        //             fullWidth
        //             >
        //                 Inventory
        //             </Button>
        //             <Divider></Divider>
        //         </Grid>
        //     </Grid>
        //     <Grid container spacing={0}>
        //         <Grid size={12}>
        //             <Button
        //             component={Link}
        //             to="/settings/auth/password-reset"
        //             variant="text"
        //             endIcon={<ArrowForwardIosIcon/>}
        //             sx={{justifyContent:'space-between',height:60}}
        //             size="large"
        //             fullWidth
        //             >
        //                 Fixed Assets
        //             </Button>
        //         </Grid>
        //     </Grid>
        // </Stack>  
        // </Paper>

        <Paper elevation={0} square>
            <Stack spacing={2}>
                <Grid container spacing={{xs:2,sm:6}} sx={{padding:mobile ? 2 : 6}}>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Bank'
                        link='/accounts/bank'
                        icon={<AccountBalanceIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents money held in bank accounts.'
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Cash'
                        link='/accounts/cash'
                        icon={<PaidIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents physical cash accounts such as safe or register.'
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Accounts Receivable'
                        link='/accounts/accounts-receivable'
                        icon={<ReceiptIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents money owed by customers (accounts receivable).'
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Inventory'
                        icon={<InventoryIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents goods held for sale or production.'
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    )
}

export default Assets
