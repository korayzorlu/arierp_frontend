import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import { Button, Chip, Grid, Stack } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { addBankActivity, fetchBankAccountTransactions, resetBankAccountTransactionsParams, setBankAccountTransactionsParams, updateBankAccountTransaction } from '../../../store/slices/finance/bankAccountTransactionSlice';
import { parseDate } from '../../../utils/stirngUtils';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ListTableServer from 'component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { gridClasses } from '@mui/x-data-grid-premium';
import FinmaksTransactionNameDialog from 'component/dialog/FinmaksTransactionNameDialog';

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
    const [selectedRow, setSelectedRow] = useState({})

    useEffect(() => {
            dispatch(resetBankAccountTransactionsParams());
        }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankAccountTransactions({activeCompany,params:bankAccountTransactionsParams})).unwrap();
        });
    }, [activeCompany,bankAccountTransactionsParams,dispatch]);

    const columns = [
        { field: 'transaction_date', headerName: 'Tarih', width: 120, sortComparator: (a, b) => parseDate(a) - parseDate(b) },
        { field: 'transaction_id', headerName: 'İşlem ID', width: 90 },
        { field: 'explanation_field', headerName: 'Açıklama', width: 520 },
        { field: 'amount', headerName: 'Tutar', width: 140, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 60 },
        { field: 'bank_name', headerName: 'Banka', width: 120 },
        { field: 'bank_account_no', headerName: 'Banka Hesabı', width: 220 },
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
                                    setSelectedRow(params.row);
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
                <ListTableServer
                title="Banka Hesap Hareketleri"
                rows={bankAccountTransactions}
                columns={columns}
                getRowId={(row) => row.transaction_id}
                loading={bankAccountTransactionsLoading}
                rowCount={bankAccountTransactionsCount}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yeni"
                        link="/bank-account-transactions/add"
                        disabled={activeCompany ? false : true}
                        icon={<AddBoxIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankAccountTransactions({activeCompany,params:bankAccountTransactionsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankAccountTransactionsParams(value))}
                headerFilters={true}
                apiRef={apiRef}
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
                autoRowHeight
                sx={{
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
                />
                <FinmaksTransactionNameDialog
                row={selectedRow}
                />
            </Grid>
        </PanelContent>
    )
}

export default BankAccountTransactions
