import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import ListTable from 'component/table/ListTable';
import { fetchBankAccountBalances, setBankAccountBalancesParams } from 'store/slices/finance/bankAccountSlice';
import { DatePicker, DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import BankAccountsTable from '../components/BankAccountsTable';

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
        { field: 'current_amount', headerName: '24.12.2025', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]

    const bankAccountColumns = [
        { field: 'account_no', headerName: 'Hesap', flex: 2,
            renderCell: (params) => (
                params.value === "TOPLAM" 
                ?
                    (
                        <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                {params.value}
                            </Typography>
                        </Stack>
                    )
                :
                    params.value
            )
        },
        { field: 'balance', headerName: 'Bakiye', flex: 2, type: 'number',
            renderCell: (params) => (
                params.row.account_no === "TOPLAM" 
                ?
                    (
                        <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                            <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'right', width: '100%'}}>
                                {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)}
                            </Typography>
                        </Stack>
                    )
                :
                    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
            ),
        },
    ]

    function formatTRY(amount) {
        // if(amount === undefined || amount === null) return "0,00";
        // return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(amount)
    }

    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');

    const handleDateRangeChange = (newValue) => {
        const startDate = newValue[0] ? dayjs(newValue[0]).format('YYYY-MM-DD') : null;
        const endDate = newValue[1] ? dayjs(newValue[1]).format('YYYY-MM-DD') : null;
        //setFilterDate({start: startDate, end: endDate});
    }

    return (
        <PanelContent>
            {/* <Grid container spacing={1}>
                <Grid size={{xs:12,sm:4}}>
                    <ListTable
                    title="TRY Kullanılabilir Bakiye"
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
                    noColumnHeaders
                    //noToolbar
                    noToolbarButtons
                    hideFooter
                    />
                </Grid>
                <Grid size={{xs:12,sm:4}}>
                    <ListTable
                    title="USD Kullanılabilir Bakiye"
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
                    noColumnHeaders
                    //noToolbar
                    noToolbarButtons
                    hideFooter
                    />
                </Grid>
                <Grid size={{xs:12,sm:4}}>
                    <ListTable
                    title="EUR Kullanılabilir Bakiye"
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
                    noColumnHeaders
                    //noToolbar
                    noToolbarButtons
                    hideFooter
                    />
                </Grid>
                
            </Grid> */}



            <Stack spacing={1}>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Typography gutterBottom variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>
                                BANKA HESAP BAKİYELERİ
                            </Typography>
                            <Grid size={{xs:12,sm:12}} sx={{textAlign: 'center'}}>
                                <DatePicker
                                defaultValue={today}
                                onAccept={handleDateRangeChange}
                                format='DD.MM.YYYY'
                                slotProps={{
                                    textField: { size: 'small' }
                                }}
                                />
                            </Grid>
                            
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Typography gutterBottom variant="body2" color="text.secondary">
                                KULLANILABİLİR BAKİYE
                            </Typography>
                            <Typography gutterBottom variant="body2">
                                Tüm banka hesaplarının kullanılabilir bakiyelerinin toplamı.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances.try_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        USD
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances.usd_balance)}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        USD/TRY
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances.usd_try_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        EUR
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances.eur_balance)}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        EUR/TRY
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances.eur_try_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        GENEL TOPLAM TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body1" sx={{fontWeight: 'bold'}}>
                                        {formatTRY(bankAccountBalances.active_balances.total_try_balance)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                {/* <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Typography gutterBottom variant="body2" color="text.secondary">
                                YAPI VE KREDİ BANKASI
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid> */}

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Typography gutterBottom variant="body2" color="text.secondary">
                                BANKA HESAP BAKİYELERİ
                            </Typography>
                            <Typography gutterBottom variant="body2">
                                Tüm banka hesaplarının kullanılabilir bakiyeleri.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <BankAccountsTable title="YAPI KREDİ - TRY" rows={bankAccountBalances.bank_accounts.yapi_kredi.try}/>
                <BankAccountsTable title="YAPI KREDİ - USD" rows={bankAccountBalances.bank_accounts.yapi_kredi.usd}/>
                <BankAccountsTable title="YAPI KREDİ - EUR" rows={bankAccountBalances.bank_accounts.yapi_kredi.eur}/>

                <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts.albaraka.try}/>
                <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts.albaraka.usd}/>
                <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts.albaraka.eur}/>

                <BankAccountsTable title="VAKIFBANK - TRY" rows={bankAccountBalances.bank_accounts.vakifbank.try}/>
                <BankAccountsTable title="VAKIFBANK - USD" rows={bankAccountBalances.bank_accounts.vakifbank.usd}/>
                <BankAccountsTable title="VAKIFBANK - EUR" rows={bankAccountBalances.bank_accounts.vakifbank.eur}/>

                <BankAccountsTable title="VAKIF KATILIM - TRY" rows={bankAccountBalances.bank_accounts.vakif_katilim.try}/>
                <BankAccountsTable title="VAKIF KATILIM - USD" rows={bankAccountBalances.bank_accounts.vakif_katilim.usd}/>
                <BankAccountsTable title="VAKIF KATILIM - EUR" rows={bankAccountBalances.bank_accounts.vakif_katilim.eur}/>

                <BankAccountsTable title="AKBANK - TRY" rows={bankAccountBalances.bank_accounts.akbank.try}/>
                <BankAccountsTable title="AKBANK - USD" rows={bankAccountBalances.bank_accounts.akbank.usd}/>
                <BankAccountsTable title="AKBANK - EUR" rows={bankAccountBalances.bank_accounts.akbank.eur}/>

                <BankAccountsTable title="İŞ BANKASI - TRY" rows={bankAccountBalances.bank_accounts.is_bank.try}/>

                <BankAccountsTable title="GARANTİ - TRY" rows={bankAccountBalances.bank_accounts.garanti.try}/>
                <BankAccountsTable title="GARANTİ - USD" rows={bankAccountBalances.bank_accounts.garanti.usd}/>
                <BankAccountsTable title="GARANTİ - EUR" rows={bankAccountBalances.bank_accounts.garanti.eur}/>

                <BankAccountsTable title="HALKBANK - TRY" rows={bankAccountBalances.bank_accounts.halkbank.try}/>
                <BankAccountsTable title="HALKBANK - USD" rows={bankAccountBalances.bank_accounts.halkbank.usd}/>
                <BankAccountsTable title="HALKBANK - EUR" rows={bankAccountBalances.bank_accounts.halkbank.eur}/>

                <BankAccountsTable title="ZİRAAT - TRY" rows={bankAccountBalances.bank_accounts.ziraat.try}/>
                <BankAccountsTable title="ZİRAAT - USD" rows={bankAccountBalances.bank_accounts.ziraat.usd}/>
                <BankAccountsTable title="ZİRAAT - EUR" rows={bankAccountBalances.bank_accounts.ziraat.eur}/>

                <BankAccountsTable title="ZİRAAT KATILIM - TRY" rows={bankAccountBalances.bank_accounts.ziraat_katilim.try}/>
                <BankAccountsTable title="ZİRAAT KATILIM - USD" rows={bankAccountBalances.bank_accounts.ziraat_katilim.usd}/>
                <BankAccountsTable title="ZİRAAT KATILIM - EUR" rows={bankAccountBalances.bank_accounts.ziraat_katilim.eur}/>

                <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts.turkiye_finans.try}/>
                <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts.turkiye_finans.usd}/>
                <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts.turkiye_finans.eur}/>

                <BankAccountsTable title="TÜRKİYE EKONOMİ BANKASI - TRY" rows={bankAccountBalances.bank_accounts.teb.try}/>

                <BankAccountsTable title="KUVEYTTÜRK - TRY" rows={bankAccountBalances.bank_accounts.kuveytturk.try}/>

                <BankAccountsTable title="EMLAK KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts.emlak_katilim.try}/>
                <BankAccountsTable title="EMLAK KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts.emlak_katilim.usd}/>
                <BankAccountsTable title="EMLAK KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts.emlak_katilim.eur}/>

            </Stack>
        </PanelContent>
    )
}

export default BankAccountBalances
