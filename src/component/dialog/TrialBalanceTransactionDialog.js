import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setTrialBalanceTransactionDialog, setMessageDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, Stack } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchTrialBalanceTransactionsInLease } from 'store/slices/accounting/trialBalanceTransactionSlice';
import { gridClasses } from '@mui/x-data-grid-premium';

function TrialBalanceTransactionDialog(props) {
    const {user} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalanceTransactionDialog} = useSelector((store) => store.notification);
    const {trialBalanceTransactionsLoading,trialBalanceTransactionsInLease} = useSelector((store) => store.trialBalanceTransaction);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchTrialBalanceTransactionsInLease({activeCompany,trialBalanceTransactionsInLeaseCode}));
    // }, [activeCompany, trialBalanceTransactionsInLeaseCode, dispatch]);

    const handleClose = () => {
        dispatch(setTrialBalanceTransactionDialog(false))
    };

    const columns = [
        { field: 'transaction_date', headerName: 'İşlem Tarihi', width: 120 },
        { field: 'trial_balance', headerName: 'Mizan Hesabı', width: 200 },
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
        <MUIDialog
        open={trialBalanceTransactionDialog}
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
                            title={`Hesap - ${trialBalanceTransactionsInLease ? trialBalanceTransactionsInLease.length > 0 ? trialBalanceTransactionsInLease[0]["trial_balance"] : "" : ""}`}
                            rows={trialBalanceTransactionsInLease}
                            columns={columns}
                            getRowId={(row) => row.uuid}
                            disableRowSelectionOnClick={true}
                            loading={trialBalanceTransactionsLoading}
                            autoRowHeight
                            sx={{
                                [`& .${gridClasses.cell}`]: {
                                    py: 1,
                                },
                            }}
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

export default TrialBalanceTransactionDialog
