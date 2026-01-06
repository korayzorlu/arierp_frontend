import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrialBalanceTransactions, fetchTrialBalanceTransactionsInLease, resetTrialBalanceTransactionsParams, setTrialBalanceTransactionsLoading, setTrialBalanceTransactionsParams } from '../../../store/slices/accounting/trialBalanceTransactionSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog, setTrialBalanceTransactionDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import { fetchMainAccountCodes } from 'store/slices/accounting/trialBalanceSlice';

function TrialBalanceTransactions() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalanceTransactions,trialBalanceTransactionsCount,trialBalanceTransactionsParams,trialBalanceTransactionsLoading} = useSelector((store) => store.trialBalanceTransaction);
    const {mainAccountCodes,mainAccountCodesParams} = useSelector((store) => store.trialBalance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        dispatch(resetTrialBalanceTransactionsParams());
    }, [activeCompany,dispatch]);

    const fetchData = async () => {
        await dispatch(fetchMainAccountCodes({activeCompany,params:mainAccountCodesParams})).unwrap();
        await dispatch(fetchTrialBalanceTransactions({activeCompany,params:trialBalanceTransactionsParams})).unwrap();
    }

    useEffect(() => {
        startTransition(() => {
            fetchData();
        });
    }, [activeCompany,trialBalanceTransactionsParams,mainAccountCodesParams,dispatch]);

    const columns = [
        { field: 'main_account_code', headerName: 'Ana Hesap Kodu', width: 100,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { label: "Tümü", value: "all" },
                    ...mainAccountCodes.map((code) => ({ label: code, value: code }))
                ]}
                />
            )
        },
        { field: 'transaction_date', headerName: 'İşlem Tarihi', width: 120 },
        { field: 'trial_balance', headerName: 'Mizan Hesabı', width: 200},
        { field: 'account_name', headerName: 'Hesap Adı', width: 400 },
        { field: 'transaction_text', headerName: 'İşlem Metni', width: 400 },
        { field: 'amount_type', headerName: 'İşlem Tipi', width: 200, renderCell: (params) => (
                params.value === "0"
                ?
                    "Alacak"
                :
                    "Borç"
            )
        },
        { field: 'amount', headerName: 'Tutar', width: 140 , type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 80 },
        { field: 'local_amount', headerName: 'Yerel Tutar', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'user', headerName: 'Kullanıcı', width: 200 },
        
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Mizan Hareketleri Listesi"
                rows={trialBalanceTransactions}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={trialBalanceTransactionsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTrialBalanceTransactions({activeCompany,params:trialBalanceTransactionsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={trialBalanceTransactionsCount}
                setParams={(value) => dispatch(setTrialBalanceTransactionsParams(value))}
                headerFilters={true}
                autoRowHeight
                sx={{
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default TrialBalanceTransactions
