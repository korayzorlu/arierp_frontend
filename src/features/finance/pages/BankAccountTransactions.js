import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import { Button, Chip, Grid, Stack } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { addBankActivity, fetchBankAccountTransactions, setBankAccountTransactionsParams, updateBankAccountTransaction } from '../../../store/slices/finance/bankAccountTransactionSlice';
import { parseDate } from '../../../utils/stirngUtils';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

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
            dispatch(fetchBankAccountTransactions({activeCompany})).unwrap();
        });
    }, [activeCompany,bankAccountTransactionsParams,dispatch]);



    const columns = [
        { field: 'transaction_date', headerName: 'Tarih', width: 160, sortComparator: (a, b) => parseDate(a) - parseDate(b) },
        { field: 'explanation_field', headerName: 'Açıklama', width: 520 },
        { field: 'amount', headerName: 'Tutar', width: 140, type: 'number', renderHeaderFilter: () => null },
        { field: 'bank_name', headerName: 'Banka', width: 140 },
        { field: 'bank_account_no', headerName: 'Banka Hesabı', width: 240 },
        { field: 'tahsilat', headerName: 'Tahsilat İşleme', width: 240, renderHeaderFilter: () => null, renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.debit === "+"
                        ?
                            params.row.bank_activity
                            ?
                                <Chip key={params.row.transaction_id} variant='contained' color="success" icon={<CheckIcon />} label="Tahsilata Gönderildi" size='small'/>
                            :
                                <Button
                                key={params.row.transaction_id}
                                variant='contained'
                                color="info"
                                endIcon={<ArrowOutwardIcon />}
                                size='small'
                                onClick={() => {
                                    dispatch(addBankActivity({data:params.row}));
                                    dispatch(updateBankAccountTransaction({transaction_id: params.row.transaction_id}));
                                    
                                }}
                                >
                                    Tahsilata Gönder
                                </Button>
                        :
                            null
                    }
                </Stack>
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
                getRowId={(row) => row.transaction_id}
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
                disableRowSelectionOnClick
                initialState={{
                    sorting: {
                        sortModel: [
                        {
                            field: 'transaction_date',
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
