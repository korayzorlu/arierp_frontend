import ListTable from 'component/table/ListTable';
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBddkHesaplar, fetchBl222af, resetBl222afParams, setBddkHesaplarParams, setBl222afParams } from 'store/slices/accounting/bddkSlice';
import { fetchMainAccountCodes, fetchTrialBalances, resetTrialBalancesParams } from 'store/slices/accounting/trialBalanceSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomTableButton from 'component/table/CustomTableButton';
import { Grid, Stack, Typography } from '@mui/material';

function Bl222af() {
     const {user} = useSelector((store) => store.auth);
     const {activeCompany} = useSelector((store) => store.organization);
     const {bl222af,bl222afCount,bl222afParams,bl222afLoading} = useSelector((store) => store.bddk);

     const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetBl222afParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBl222af({activeCompany}));
        });
    }, [activeCompany,bl222afParams,dispatch]);

    const columns = [
        { field: 'sira_no', headerName: 'Sıra No', width: 200 },
        { field: 'sira_adi', headerName: 'Sıra Adı', width: 200 },
        { field: 'currency', headerName: 'PB', width: 200, renderHeaderFilter: () => null },
    ]

    return (
        <Stack spacing={1}>
            <Grid container spacing={1}>
                <Grid size={{xs:12}} textAlign="center">
                    <Typography variant="body2">BANKA DIŞI MALİ KURUMLAR GÖZETİM SİSTEMİ</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Typography variant="body2" sx={{pl: 4}}>KURUM ADI : ARI FİNANSAL KİRALAMA A.Ş.</Typography>
                    <Typography variant="body2" sx={{pl: 4}}>KURUM KODU : 370</Typography>
                    <Typography variant="body2" sx={{pl: 4}}>FORM ADI : BİLANÇO (YURTİÇİ-YURTDIŞI ŞUBELER TOPLAMI)</Typography>
                    <Typography variant="body2" sx={{pl: 4}}>FORM KODU : BL221AF</Typography>
                    <Typography variant="body2" sx={{pl: 4}}>PARA BİRİMİ : BİN TL</Typography>
                </Grid>
                <Grid size={{xs:12,sm:6}} textAlign="right">
                    <Typography variant="body2" sx={{pr: 4}}>DÖNEM : 11 / 2025</Typography>
                </Grid>
            </Grid>
            <ListTable
            title=""
            height="calc(100vh - 150px)"
            rows={bl222af}
            columns={columns}
            getRowId={(row) => row.id}
            loading={bl222afLoading}
            customButtons={
                <>
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchBl222af({activeCompany})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            setParams={(value) => dispatch(setBl222afParams(value))}
            //headerFilters={true}
            //noDownloadButton
            />
        </Stack>
        
    )
}

export default Bl222af
