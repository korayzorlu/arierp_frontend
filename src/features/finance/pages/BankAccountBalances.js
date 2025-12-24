import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import ListTable from 'component/table/ListTable';
import { fetchBankAccountBalances, setBankAccountBalancesParams } from 'store/slices/finance/bankAccountSlice';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function BankAccountBalances() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankAccountBalances,bankAccountBalancesCount,bankAccountBalancesLoading} = useSelector((store) => store.bankAccount);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankAccountBalances({activeCompany}));
        });
    }, [activeCompany,dispatch]);

    const activeBalancesColumns = [
        { field: 'label', headerName: '', flex: 2 },
        { field: 'two_days_ago_amount', headerName: '22.12.2025', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'yesterday_amount', headerName: '23.12.2025', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'current_amount', headerName: '24.12.2025', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]

    function formatTRY(amount) {
        // if(amount === undefined || amount === null) return "0,00";
        // return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(amount)
    }

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Kullanılabilir Bakiye"
                autoHeight
                rows={bankAccountBalances.active_balances || []}
                columns={activeBalancesColumns}
                getRowId={(row) => row.id}
                loading={bankAccountBalancesLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankAccountBalances({activeCompany})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                noDownloadButton
                />
            </Grid>



            {/* <Stack spacing={1}>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 1}}>
                            <Typography gutterBottom variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                                KULLANILABİLİR BAKİYE
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:4,sm:4}}>
                        <Paper elevation={0} square={true} sx={{p: 1}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        TRY
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTRY(bankAccountBalances.try_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:4,sm:4}}>
                        <Paper elevation={0} square={true} sx={{p: 1}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        USD
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTRY(bankAccountBalances.usd_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:4,sm:4}}>
                        <Paper elevation={0} square={true} sx={{p: 1}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        EUR
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTRY(bankAccountBalances.eur_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 1}}>
                            <Typography gutterBottom variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                                KULLANILABİLİR BAKİYE
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

            </Stack> */}
        </PanelContent>
    )
}

export default BankAccountBalances
