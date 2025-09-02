import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import { Button, Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchBankAccountTransactions, setBankAccountTransactionsParams } from '../../../store/slices/finance/bankAccountTransactionSlice';
import { parseDate } from '../../../utils/stirngUtils';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function BankAccountTransactions() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankAccountTransactions,bankAccountTransactionsCount,bankAccountTransactionsParams,bankAccountTransactionsLoading} = useSelector((store) => store.bankAccountTransaction);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankAccountTransactions({activeCompany}));
        });
    }, [activeCompany,bankAccountTransactionsParams,dispatch]);

    const columns = [
        { field: 'TransactionDate', headerName: 'Tarih', width: 160, sortComparator: (a, b) => parseDate(a) - parseDate(b) },
        { field: 'ExplanationField', headerName: 'Açıklama', width: 520 },
        { field: 'Amount', headerName: 'Tutar', width: 140, type: 'number', renderHeaderFilter: () => null },
        { field: 'BankName', headerName: 'Banka', width: 140 },
        { field: 'OwnerAccountNo', headerName: 'Banka Hesabı', width: 240 },
        { field: 'tahsilat', headerName: 'Tahsilat İşleme', width: 240, renderCell: (params) => (
                params.row.Debit === "+"
                ?
                    <Button key={params.row.TransactionId} variant='contained' color="success" endIcon={<ArrowRightAltIcon />} size='small'>
                        Tahsilata Gönder
                    </Button>
                :
                    null
                
            ) 
        },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Banka Hesap Hareketleri"
                rows={bankAccountTransactions}
                columns={columns}
                getRowId={(row) => row.TransactionId}
                loading={bankAccountTransactionsLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankAccountTransactions({activeCompany})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankAccountTransactionsParams(value))}
                headerFilters={true}
                noDownloadButton
                initialState={{
                    sorting: {
                        sortModel: [
                        {
                            field: 'TransactionDate',
                            sort: 'desc',
                        },
                        ],
                    },
                }}
                />
            </Grid>
        </PanelContent>
    )
}

export default BankAccountTransactions
