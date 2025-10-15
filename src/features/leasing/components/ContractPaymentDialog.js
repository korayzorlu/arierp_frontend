import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setContractPaymentDialog, setMessageDialog } from '../../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, Stack } from '@mui/material';
import BasicTable from '../../../component/table/BasicTable';
import { fetchContractPaymentsInLease } from '../../../store/slices/contracts/contractSlice';

function ContractPaymentDialog(props) {
    const {user} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {contractPaymentDialog} = useSelector((store) => store.notification);
    const {contractPaymentsLoading,contractPaymentsInLease,contractPaymentsInLeaseCode} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchContractPaymentsInLease({activeCompany,contractPaymentsInLeaseCode}));
    // }, [])

    const handleClose = () => {
        dispatch(setContractPaymentDialog(false))
    };

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No' },
        { field: 'trn_from_id', headerName: 'Nereden' },
        { field: 'type', headerName: 'Nereye' },
        { field: 'posting_type', headerName: 'İşlem Tipi', width: 150 },
        { field: 'group_name', headerName: 'İşlem Grubu' },
        { field: 'account_code', headerName: 'Hesap Kart Kodu' },
        { field: 'account_name', headerName: 'Cari Kart Adı', width: 250 },
        { field: 'date', headerName: 'İşlem Tarihi' },
        { field: 'debit_amount', headerName: 'Borç', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'credit_amount', headerName: 'Alacak', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'local_debit_amount', headerName: 'Yerel Borç', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'local_credit_amount', headerName: 'Yerel Alacak', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'exchange_rate', headerName: 'Kur(Yerel)', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'description', headerName: 'Açıklama', width: 400 },
        { field: 'user_name', headerName: 'Oluşturan' },
    ]

    return (
        <MUIDialog
        open={contractPaymentDialog}
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
                            title={`Sözleşme - ${contractPaymentsInLease ? contractPaymentsInLease.length > 0 ? contractPaymentsInLease[0]["contract"] : "" : ""}`}
                            rows={contractPaymentsInLease}
                            columns={columns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick={true}
                            loading={contractPaymentsLoading}
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

export default ContractPaymentDialog
