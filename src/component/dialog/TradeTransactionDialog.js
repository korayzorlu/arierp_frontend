import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setTradeTransactionDialog, setMessageDialog } from '../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, Stack, Typography } from '@mui/material';
import BasicTable from '../table/BasicTable';
import { fetchTradeTransactionsInLease } from '../../store/slices/trade/tradeTransactionSlice';

function TradeTransactionDialog(props) {
    const {user} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {tradeTransactionDialog} = useSelector((store) => store.notification);
    const {tradeTransactionsLoading,tradeTransactionsInLease,tradeTransactionsInLeaseCode} = useSelector((store) => store.tradeTransaction);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchTradeTransactionsInLease({activeCompany,tradeTransactionsInLeaseCode}));
    // }, [])

    const handleClose = () => {
        dispatch(setTradeTransactionDialog(false))
    };

    const rowsWithBalance = [];
    let newIndex = 0;
    tradeTransactionsInLease.map((row, index) => {
        const prevRow = newIndex > 0 ? rowsWithBalance[newIndex - 1] : null;
        if((prevRow && prevRow.posting_group_name !== row.posting_group_name && !prevRow.is_total)){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: prevRow.posting_group_name + ' Toplamı',
                document_no: null,
                description: null,
                currency: null,
                amount: null,
                amount_type: null,
                balances: {balance: prevRow.balances.balance, tl_balance: prevRow.balances.tl_balance},
                exchange_rate: null,
                local_amount: null,
                _balances: null,
            })
            newIndex += 1;
        }
        newIndex += 1;
        rowsWithBalance.push({...row, is_total: false});
        if(index + 1 === tradeTransactionsInLease.length){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: row.posting_group_name + ' Toplamı',
                document_no: null,
                description: null,
                currency: null,
                amount: null,
                amount_type: null,
                balances: {balance: row.balances.balance, tl_balance: row.balances.tl_balance},
                exchange_rate: null,
                local_amount: null,
                _balances: null,
            })
        }
    })

    const columns = [
        { field: 'due_date', headerName: 'Vade Tarihi', flex: 1, sortable: false },
        { field: 'record_date', headerName: 'Kayıt Tarihi', flex: 1.5, sortable: false },
        { field: 'posting_group_name', headerName: 'İşlem Grubu', flex: 1.5, sortable: false },
        { field: 'document_no', headerName: 'Belge No', flex: 1, sortable: false },
        { field: 'description', headerName: 'Açıklama', width: 400, sortable: false },
        { field: 'amount_type', headerName: 'İşlem Tİpi', flex: 1, sortable: false, renderCell : (params) =>
            !params.row.is_total
            ?
                params.value === '1'
                ?
                    'Borç'
                :
                    'Alacak'
            :
                null
        },
        { field: 'amount', headerName: 'Tutar', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
            !params.row.is_total
            ?
                params.row.amount_type === '1'
                ?
                    <Typography variant='body' sx={{color: 'error.main'}}>
                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)}
                    </Typography>
                :
                    <Typography variant='body' sx={{color: 'success.main'}}>
                        -{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)}
                    </Typography>
            :
                null
        },
        { field: 'balances', headerName: 'Bakiye', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.balances.balance <= 0
            ?
                <Typography variant='body' sx={{color: 'success.main'}}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance)}
                </Typography>
            :
                <Typography variant='body' sx={{color: 'error.main'}}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance)}
                </Typography>
        },
        { field: 'currency', headerName: 'PB', flex: 1, sortable: false },
        // { field: 'exchange_rate', headerName: 'Kur', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, valueFormatter: (value) =>
        //     value
        //     ?
        //         new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        //     :
        //         null
        // },
        // { field: 'local_amount', headerName: 'TL Tutar', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
        //     !params.row.is_total
        //     ?
        //         params.row.amount_type === '1'
        //         ?
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.local_amount)
        //         :
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(-params.row.local_amount)
        //     :
        //         null
        // },
        // { field: '_balances', headerName: 'TL Bakiye', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
        //     new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.tl_balance)
        // },
    ]

    return (
        <MUIDialog
        open={tradeTransactionDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xl"
        fullWidth
        >
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <>
                            <BasicTable
                            title={
                                `
                                ${
                                    tradeTransactionsInLease
                                    ?
                                        tradeTransactionsInLease.length > 0
                                        ?
                                            tradeTransactionsInLease[0]["lease"]
                                        : ""
                                    :
                                        ""
                                }
                                `
                            }
                            rows={rowsWithBalance}
                            columns={columns}
                            getRowId={(row) => row.uuid}
                            checkboxSelection={false}
                            disableRowSelectionOnClick={true}
                            loading={tradeTransactionsLoading}
                            getRowClassName={(params) => `super-app-theme--${params.row.is_total ? "today" : ""}`}
                            // initialState={{
                            //     aggregation: {
                            //         model: {
                            //             debit_amount: 'sum',
                            //             credit_amount: 'sum',
                            //             local_debit_amount: 'sum',
                            //             local_credit_amount: 'sum',
                            //         },
                            //     },
                            // }}
                            />
                        </>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default TradeTransactionDialog
