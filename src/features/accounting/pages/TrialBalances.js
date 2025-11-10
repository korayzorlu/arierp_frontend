import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainAccountCodes, fetchTrialBalances, resetTrialBalancesParams, setTrialBalancesParams } from '../../../store/slices/accounting/trialBalanceSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';

function TrialBalances() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalances,trialBalancesCount,trialBalancesParams,trialBalancesLoading,mainAccountCodes,mainAccountCodesParams} = useSelector((store) => store.trialBalance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        dispatch(resetTrialBalancesParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTrialBalances({activeCompany,params:trialBalancesParams}));
            dispatch(fetchMainAccountCodes({activeCompany,params:mainAccountCodesParams}));
        });
    }, [activeCompany,trialBalancesParams,mainAccountCodesParams,dispatch]);

    const columns = [
        { field: 'main_account_code', headerName: 'Ana Hesap Kodu', width: 100,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                options={[
                    { label: "Tümü", value: "all" },
                    ...mainAccountCodes.map((code) => ({ label: code, value: code }))
                ]}
                />
            )
         },
        { field: 'account_code', headerName: 'Hesap Kodu', width: 200 },
        { field: 'account_name', headerName: 'Hesap Adı', width: 400 },
        { field: 'contract', headerName: 'Sözleşme' },
        { field: 'currency', headerName: 'PB' },
        { field: 'balance_debit', headerName: 'Borç Toplamı', width: 140 , type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_credit', headerName: 'Alacak Toplamı', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_debit', headerName: 'Borç Bakiyesi', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_credit', headerName: 'Alacak Bakiyesi', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_tl', headerName: 'TL Bakiye', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_debit_alternate', headerName: 'Borç Toplam', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_credit_alternate', headerName: 'Alacak Toplamı', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_debit_alternate', headerName: 'Borç Bakiyesi', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_credit_alternate', headerName: 'Alacak Bakiyesi', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_currency', headerName: 'Döviz Bakiye', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Mizan Listesi"
                rows={trialBalances}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={trialBalancesLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTrialBalances({activeCompany,params:trialBalancesParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={trialBalancesCount}
                setParams={(value) => dispatch(setTrialBalancesParams(value))}
                headerFilters={true}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default TrialBalances
