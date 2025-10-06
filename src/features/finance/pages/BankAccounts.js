import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchBankAccounts, setBankAccountsParams } from '../../../store/slices/finance/bankAccountSlice';
import { turkishSortComparator } from '../../../utils/stirngUtils';

function BankAccounts() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankAccounts,bankAccountsCount,bankAccountsParams,bankAccountsLoading} = useSelector((store) => store.bankAccount);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankAccounts({activeCompany,params:{...bankAccountsParams,paginate:false}})).unwrap();
        });
    }, [activeCompany,bankAccountsParams,dispatch]);

    const columns = [
        { field: 'bank_name', headerName: 'Banka', width: 140 },
        { field: 'iban', headerName: 'IBAN', width: 140 },
        { field: 'account_no', headerName: 'Hesap NO', width: 240 },
        { field: 'branch_code', headerName: 'Şube Kodu', width: 140 },
        { field: 'branch_name', headerName: 'Şube Adı', width: 240 },
        { field: 'balance', headerName: 'Bakiye', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'available_balance', headerName: 'Kullanılabilir Bakiye', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'blocked_balance', headerName: 'Bloke Bakiye', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Banka Hesapları"
                rows={bankAccounts}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={bankAccountsLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankAccounts({activeCompany})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankAccountsParams(value))}
                headerFilters={true}
                //noDownloadButton
                />
            </Grid>
        </PanelContent>
    )
}

export default BankAccounts
