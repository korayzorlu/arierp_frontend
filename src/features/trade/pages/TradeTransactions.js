import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradeTransactions, setTradeTransactionsParams } from '../../../store/slices/trade/tradeTransactionSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';

function TradeTransactions() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {tradeTransactions,tradeTransactionsCount,tradeTransactionsParams,tradeTransactionsLoading} = useSelector((store) => store.tradeTransaction);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTradeTransactions({activeCompany,params:tradeTransactionsParams}));
        });
    }, [activeCompany,tradeTransactionsParams,dispatch]);

    const columns = [
        { field: 'due_date', headerName: 'Vade Tarihi', flex: 2 },
        { field: 'record_date', headerName: 'Kayıt Tarihi', flex: 2 },
        { field: 'lease', headerName: 'Kira Planı', flex: 2 },
        { field: 'partner', headerName: 'Müşteri', width: 200 },
        { field: 'posting_group_name', headerName: 'İşlem Grubu', flex: 2 },
        { field: 'document_no', headerName: 'Belge No', flex: 2 },
        { field: 'description', headerName: 'Açıklama', width: 400 },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'debit', headerName: 'Borç', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.amount_type === '1'
            ?
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)
            :
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(0)
        },
        { field: 'credit', headerName: 'Alacak', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.amount_type === '0'
            ?
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)
            :
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(0)
        },
        { field: 'amount_type', headerName: 'PB', flex: 2, renderCell : (params) =>
            params.value === '1'
            ?
                'B'
            :
                'A'
        },
        { field: 'exchange_rate', headerName: 'Kur', flex: 2, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'local_debit', headerName: 'Borç', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.amount_type === '1'
            ?
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.local_amount)
            :
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(0)
        },
        { field: 'local_credit', headerName: 'Alacak', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.amount_type === '0'
            ?
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.local_amount)
            :
                new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(0)
        },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Cari Hesap Hareketleri"
                rows={tradeTransactions}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={tradeTransactionsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTradeTransactions({activeCompany,params:tradeTransactionsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={tradeTransactionsCount}
                setParams={(value) => dispatch(setTradeTransactionsParams(value))}
                headerFilters={true}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default TradeTransactions
