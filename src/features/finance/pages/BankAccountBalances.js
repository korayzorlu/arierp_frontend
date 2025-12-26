import React, { lazy, Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import ListTable from 'component/table/ListTable';
import { fetchBankAccountBalances, fetchBankAccountDailyRecords, fetchBankAccounts, resetBankAccountBalances, setBankAccountBalancesParams } from 'store/slices/finance/bankAccountSlice';
import { DatePicker, DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
//import BankAccountsTable from '../components/BankAccountsTable';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { fetchExchangeRates, fetchObjects } from 'store/slices/common/commonSlice';
import { date } from 'yup';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
const BankAccountsTable = lazy(() => import('../components/BankAccountsTable'));

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
    const {exchangeRates,exchangeRatesCount,exchangeRatesLoading,exchangeRatesParams} = useSelector((store) => store.common);
    const {bankAccountBalances,bankAccountBalancesCount,bankAccountBalancesLoading,bankAccounts,bankAccountsLoading,bankAccountsParams} = useSelector((store) => store.bankAccount);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [exchangeRatesData, setExchangeRatesData] = useState({
        usd_exchange_rate: 0,
        eur_exchange_rate: 0
    })
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [showTables, setShowTables] = useState(false);
    const [tablesMountKey, setTablesMountKey] = useState(0);
    const mountTimerRef = useRef(null);

    // const fetchData = async () => {
    //     const usd_exchange_rate_data = await dispatch(fetchExchangeRates({params:{...exchangeRatesParams,target_currency: 'USD',date}})).unwrap();
    //     const eur_exchange_rate_data = await dispatch(fetchExchangeRates({params:{...exchangeRatesParams,target_currency: 'EUR',date}})).unwrap();
        
    //     setExchangeRatesData({
    //         usd_exchange_rate: usd_exchange_rate_data.data.length > 0 ? usd_exchange_rate_data.data[0].forex_buying : 0,
    //         eur_exchange_rate: eur_exchange_rate_data.data.length > 0 ? eur_exchange_rate_data.data[0].forex_buying : 0
    //     });

    // }

    useEffect(() => {
        // ilk paint bitsin, sonra tabloları mount et
        const id = window.requestIdleCallback
        ? window.requestIdleCallback(() => setShowTables(true), { timeout: 300 })
        : setTimeout(() => setShowTables(true), 0);

        return () => {
            window.cancelIdleCallback?.(id);
            clearTimeout(id);
        };
    }, []);

    useEffect(() => {
        startTransition(() => {
            //fetchData();
            if(date === dayjs().format('YYYY-MM-DD')){
                dispatch(fetchBankAccountBalances({activeCompany,params:{date}}));
            }else{
                dispatch(resetBankAccountBalances());
                dispatch(fetchBankAccountDailyRecords({activeCompany,params:{date}}));
            }
            
        });
    }, [activeCompany,date,dispatch]);

    const mountTablesLater = () => {
  // önce varsa iptal
  if (mountTimerRef.current) {
    window.cancelIdleCallback?.(mountTimerRef.current);
    clearTimeout(mountTimerRef.current);
  }

  // idle / next tick sonrası tekrar mount
  mountTimerRef.current = window.requestIdleCallback
    ? window.requestIdleCallback(() => setShowTables(true), { timeout: 300 })
    : setTimeout(() => setShowTables(true), 0);
};

useEffect(() => {
  // ilk girişte de aynı davranış
  setShowTables(false);
  mountTablesLater();

  return () => {
    if (mountTimerRef.current) {
      window.cancelIdleCallback?.(mountTimerRef.current);
      clearTimeout(mountTimerRef.current);
    }
  };
}, []);

// ✅ kritik kısım: date değişince de aynı şeyi yap
useEffect(() => {
  setShowTables(false);
  mountTablesLater();
}, [date]);

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

    const handleDateRangeChange = async (newValue) => {
        const date = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
        setDate(date);
        setTablesMountKey((k) => k + 1);
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
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Typography gutterBottom variant="body2" color="primary" sx={{textAlign: 'center', fontWeight: 'bold'}}>
                                BANKA HESAP BAKİYELERİ
                            </Typography>
                            
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={1}>
                                <Grid size={{xs:12,sm:2}} sx={{textAlign: 'left'}}>
                                    <DatePicker
                                    defaultValue={today}
                                    onAccept={handleDateRangeChange}
                                    format='DD.MM.YYYY'
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: true},
                                    }}
                                    />
                                </Grid>
                                <Grid size={{xs:12,sm:2}} sx={{textAlign: 'left'}}>
                                     <Button
                                    variant="contained"
                                    color="mars"
                                    //onClick={handleSubmit}
                                    endIcon={<InsertDriveFileIcon/>}
                                    autoFocus
                                    fullWidth
                                    >
                                        Excel'e Aktar
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} square={true} sx={{p: 2}}>
                            <Typography gutterBottom variant="body2" color="primary">
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
                                    <Typography gutterBottom variant="body2" color="primary">
                                        TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.try_balance : 0)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:6}}>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        USD
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.usd_balance : 0)}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs:12,sm:6}}>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        <CompareArrowsIcon fontSize='1rem'/> TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.usd_try_balance : 0)}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        USD/TRY
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatTRY(bankAccountBalances.exchange_rates ? bankAccountBalances.exchange_rates.usd_exchange_rate : 0)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:6}}>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        EUR
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.eur_balance : 0)}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs:12,sm:6}}>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        <CompareArrowsIcon fontSize='1rem'/> TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.eur_try_balance : 0)}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        EUR/TRY
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatTRY(bankAccountBalances.exchange_rates ? bankAccountBalances.exchange_rates.eur_exchange_rate : 0)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:6,sm:3}}>
                        <Paper elevation={0} square={true} sx={{p: 2, height: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography gutterBottom variant="body2" color="primary">
                                        GENEL TOPLAM TRY
                                    </Typography>
                                    <Typography gutterBottom variant="body1" sx={{fontWeight: 'bold'}}>
                                        {formatTRY(bankAccountBalances.active_balances ? bankAccountBalances.active_balances.total_try_balance : 0)}
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
                            <Typography gutterBottom variant="body2" color="primary">
                                BANKA HESAP BAKİYELERİ
                            </Typography>
                            <Typography gutterBottom variant="body2">
                                Tüm banka hesaplarının kullanılabilir bakiyeleri.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                
                <Suspense
                fallback={
                    <></>
                }
                >
                    {
                        showTables
                        ?
                            (
                                <React.Fragment key={tablesMountKey}>
                                    <BankAccountsTable title="YAPI KREDİ - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.yapi_kredi.try : []}/>
                                    <BankAccountsTable title="YAPI KREDİ - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.yapi_kredi.usd : []}/>
                                    <BankAccountsTable title="YAPI KREDİ - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.yapi_kredi.eur : []}/>

                                    <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.albaraka.try : []}/>
                                    <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.albaraka.usd : []}/>
                                    <BankAccountsTable title="ALBARAKA TÜRK KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.albaraka.eur : []}/>

                                    <BankAccountsTable title="VAKIFBANK - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakifbank.try : []}/>
                                    <BankAccountsTable title="VAKIFBANK - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakifbank.usd : []}/>
                                    <BankAccountsTable title="VAKIFBANK - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakifbank.eur : []}/>

                                    <BankAccountsTable title="VAKIF KATILIM - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakif_katilim.try : []}/>
                                    <BankAccountsTable title="VAKIF KATILIM - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakif_katilim.usd : []}/>
                                    <BankAccountsTable title="VAKIF KATILIM - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.vakif_katilim.eur : []}/>

                                    <BankAccountsTable title="AKBANK - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.akbank.try : []}/>
                                    <BankAccountsTable title="AKBANK - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.akbank.usd : []}/>
                                    <BankAccountsTable title="AKBANK - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.akbank.eur : []}/>

                                    <BankAccountsTable title="İŞ BANKASI - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.is_bank.try : []}/>

                                    <BankAccountsTable title="GARANTİ - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.garanti.try : []}/>
                                    <BankAccountsTable title="GARANTİ - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.garanti.usd : []}/>
                                    <BankAccountsTable title="GARANTİ - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.garanti.eur : []}/>

                                    <BankAccountsTable title="HALKBANK - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.halkbank.try : []}/>
                                    <BankAccountsTable title="HALKBANK - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.halkbank.usd : []}/>
                                    <BankAccountsTable title="HALKBANK - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.halkbank.eur : []}/>

                                    <BankAccountsTable title="ZİRAAT - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat.try : []}/>
                                    <BankAccountsTable title="ZİRAAT - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat.usd : []}/>
                                    <BankAccountsTable title="ZİRAAT - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat.eur : []}/>

                                    <BankAccountsTable title="ZİRAAT KATILIM - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat_katilim.try : []}/>
                                    <BankAccountsTable title="ZİRAAT KATILIM - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat_katilim.usd : []}/>
                                    <BankAccountsTable title="ZİRAAT KATILIM - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.ziraat_katilim.eur : []}/>

                                    <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.turkiye_finans.try : []}/>
                                    <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.turkiye_finans.usd : []}/>
                                    <BankAccountsTable title="TÜRKİYE FİNANS KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.turkiye_finans.eur : []}/>

                                    <BankAccountsTable title="TÜRKİYE EKONOMİ BANKASI - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.teb.try : []}/>

                                    <BankAccountsTable title="KUVEYTTÜRK - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.kuveytturk.try : []}/>

                                    <BankAccountsTable title="EMLAK KATILIM BANKASI - TRY" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.emlak_katilim.try : []}/>
                                    <BankAccountsTable title="EMLAK KATILIM BANKASI - USD" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.emlak_katilim.usd : []}/>
                                    <BankAccountsTable title="EMLAK KATILIM BANKASI - EUR" rows={bankAccountBalances.bank_accounts ? bankAccountBalances.bank_accounts.emlak_katilim.eur : []}/>
                                </React.Fragment>
                            )
                        :
                            (
                                <Paper elevation={0} square sx={{ p: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                    Tablolar hazırlanıyor...
                                    </Typography>
                                </Paper>
                            )
                    }
                    
                </Suspense>
            </Stack>
        </PanelContent>
    )
}

export default BankAccountBalances
