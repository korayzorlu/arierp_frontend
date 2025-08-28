import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases } from '../../../store/slices/leasing/leaseSlice';
import { fetchAmountDebitTransactions, setAmountDebitTransactionsLoading, setAmountDebitTransactionsParams } from '../../../store/slices/risk/amountDebitTransactionSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';

function AmountDebitTransactions() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {amountDebitTransactions,amountDebitTransactionsCount,amountDebitTransactionsParams,amountDebitTransactionsLoading} = useSelector((store) => store.amountDebitTransaction);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchAmountDebitTransactions({activeCompany,params:amountDebitTransactionsParams}));
        });
    }, [activeCompany,amountDebitTransactionsParams,dispatch]);

    const columns = [
        { field: 'lease', headerName: 'Kira Planı Kodu', width:120},
        { field: 'process_group', headerName: 'İşlem Grubu' },
        { field: 'currency', headerName: 'PB' },
        { field: 'due_date', headerName: 'Tarih' },
        { field: 'process_type', headerName: 'İşlem Tipi' },
        { field: 'debit_amount', headerName: 'Borç', type: 'number', renderHeaderFilter: () => null },
        { field: 'credit_amount', headerName: 'Alacak', type: 'number', renderHeaderFilter: () => null },
        { field: 'real_amount', headerName: 'Gerçek Bakiye', type: 'number', renderHeaderFilter: () => null },
        { field: 'for_default_amount', headerName: 'Tem. Baz. Bakiye', type: 'number', renderHeaderFilter: () => null },
        { field: 'day', headerName: 'Gün' },
        { field: 'adat_amount', headerName: 'Adat', type: 'number', renderHeaderFilter: () => null },
        { field: 'interest_rate', headerName: 'Oran', type: 'number', renderHeaderFilter: () => null },
        { field: 'default_amount', headerName: 'Temerrüt(Vergisiz)', type: 'number', renderHeaderFilter: () => null },
        { field: 'overdue_interest_rate', headerName: 'Hesaplanan Gecikme Faizi(KDV Dahil)', type: 'number', renderHeaderFilter: () => null },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Bakiye Temerrüt Raporu"
            autoHeight
            rows={amountDebitTransactions}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={amountDebitTransactionsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchAmountDebitTransactions({activeCompany,params:amountDebitTransactionsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={amountDebitTransactionsCount}
            checkboxSelection
            setParams={(value) => dispatch(setAmountDebitTransactionsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default AmountDebitTransactions
