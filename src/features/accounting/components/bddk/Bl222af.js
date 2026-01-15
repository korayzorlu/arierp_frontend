import ListTable from 'component/table/ListTable';
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBddkHesaplar, fetchBl222af, resetBl222afParams, setBddkHesaplarParams, setBl222afParams } from 'store/slices/accounting/bddkSlice';
import { fetchMainAccountCodes, fetchTrialBalances, resetTrialBalancesParams } from 'store/slices/accounting/trialBalanceSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomTableButton from 'component/table/CustomTableButton';
import { Grid, Stack, Typography } from '@mui/material';
import { GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, useGridApiRef, useKeepGroupedColumnsHidden } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import ListTableServer from 'component/table/ListTableServer';

function Bl222af() {
     const {user} = useSelector((store) => store.auth);
     const {activeCompany} = useSelector((store) => store.organization);
     const {bl222af,bl222afCount,bl222afParams,bl222afLoading} = useSelector((store) => store.bddk);

     const dispatch = useDispatch();
     const apiRef = useGridApiRef();

     const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        maxColumns: 6,
    });

    useEffect(() => {
        dispatch(resetBl222afParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBl222af({activeCompany,params:bl222afParams})).unwrap();
        });
    }, [activeCompany,bl222afParams,dispatch]);

    const columns = [
        //{ field: 'type', headerName: '', width: 90, renderHeaderFilter: () => null, groupable: true, hideable: false, },
        { field: 'sira_no', headerName: 'Sıra No', width: 90, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  
                params.row.sira_adi?.text === 'AKTİF KALEMLER' || params.row.sira_adi?.text === 'PASİF KALEMLER'
                ?
                    null
                :
                    params.value
        },
        { field: 'sira_adi', headerName: 'Sıra Adı', width: 650,
            renderCell: (params) =>
                params.value
                ?
                    <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                        <Typography variant="body2" sx={{ fontWeight: params.value.font_weight }}>
                            {params.value.font_weight === 'bold' ? params.value.text : `\u00A0\u00A0\u00A0\u00A0${params.value.text}`}
                        </Typography>
                    </Stack>
                :
                    null
        },
        { field: 'tp', headerName: 'TP', width: 160, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  
                params.row.bos
                ?
                    null
                :
                    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
            
        },
        { field: 'yp_usd', headerName: 'YP USD', width: 160, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  
                params.row.bos
                ?
                    null
                :
                    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        { field: 'yp_eur', headerName: 'YP EUR', width: 160, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  
                params.row.bos
                ?
                    null
                :
                    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        // { field: 'toplam', headerName: 'Toplam', width: 160, type: 'number', renderHeaderFilter: () => null,
        //     renderCell: (params) =>  
        //         params.row.bos
        //         ?
        //             null
        //         :
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        // },
        //{ field: 'currency', headerName: 'PB', width: 200, renderHeaderFilter: () => null },
    ]

    const initialState = useKeepGroupedColumnsHidden({
        apiRef,
        initialState: {
            rowGrouping: {
                model: ['type'],
            },
        },
        pinnedColumns: { left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD] },
    });

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
            <ListTableServer
            title=""
            height="calc(100vh - 300px)"
            rows={bl222af}
            columns={columns}
            getRowId={(row) => row.id}
            loading={bl222afLoading}
            rowCount={bl222afCount}
            customButtons={
                <>
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchBl222af({activeCompany,params:bl222afParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            setParams={(value) => dispatch(setBl222afParams(value))}
            apiRef={apiRef}
            pageSize={100}
            hideFooter
            //initialState={initialState}
            //headerFilters={true}
            //noDownloadButton
            />
        </Stack>
        
    )
}

export default Bl222af
