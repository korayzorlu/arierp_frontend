import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrialBalances, setTrialBalancesParams } from '../../../store/slices/accounting/trialBalanceSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';

function TrialBalances() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalances,trialBalancesCount,trialBalancesParams,trialBalancesLoading} = useSelector((store) => store.trialBalance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTrialBalances({activeCompany,params:trialBalancesParams}));
        });
    }, [activeCompany,trialBalancesParams,dispatch]);

    const columns = [
        { field: 'account_code', headerName: 'Hesap Kodu', width: 200 },
        { field: 'account_name', headerName: 'Hesap Adı', width: 400 },
        { field: 'currency', headerName: 'PB' },
        { field: 'balance_debit', headerName: 'Borç Toplamı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_credit', headerName: 'Alacak Toplamı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_debit', headerName: 'Borç Bakiyesi', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_credit', headerName: 'Alacak Bakiyesi', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_tl', headerName: 'TL Bakiye', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_debit_alternate', headerName: 'Borç Toplam', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'balance_credit_alternate', headerName: 'Alacak Toplamı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_debit_alternate', headerName: 'Borç Bakiyesi', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_credit_alternate', headerName: 'Alacak Bakiyesi', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_currency', headerName: 'Döviz Bakiye', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
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
