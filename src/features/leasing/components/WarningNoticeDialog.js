import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setWarningNoticeDialog, setMessageDialog } from '../../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, Stack } from '@mui/material';
import BasicTable from '../../../component/table/BasicTable';
import { fetchWarningNoticesInLease } from '../../../store/slices/contracts/contractSlice';

function WarningNoticeDialog(props) {
    const {user} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {warningNoticeDialog} = useSelector((store) => store.notification);
    const {warningNoticesLoading,warningNoticesInLease,warningNoticesInLeaseCode} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(warningNoticesInLeaseCode)
        dispatch(fetchWarningNoticesInLease({activeCompany,warningNoticesInLeaseCode}));
    }, [])

    const handleClose = () => {
        dispatch(setWarningNoticeDialog(false))
    };

    const columns = [
        { field: 'partner', headerName: 'Müşteri', flex: 4 },
        { field: 'contract', headerName: 'Sözleşme No', flex: 1 },
        { field: 'process_start_date', headerName: 'İhtar Tarihi', flex: 2 },
        { field: 'service_date', headerName: 'Tebliğ Tarihi', flex: 2 },
        { field: 'official_cancellation_date', headerName: 'Öngörülen Fesih Tarihi', flex: 2 },
        { field: 'termination_days', headerName: 'Fesihe Kalan Gün Sayısı', flex: 1 },
        { field: 'debit_amount', headerName: 'İhtar Borcu', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'paid', headerName: 'Ödenen Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'diff', headerName: 'Kalan Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'state', headerName: 'Durum', flex: 1 },
    ]

    return (
        <MUIDialog
        open={warningNoticeDialog}
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
                            title={`Sözleşme - ${warningNoticesInLease ? warningNoticesInLease.length > 0 ? warningNoticesInLease[0]["contract"] : "" : ""}`}
                            rows={warningNoticesInLease}
                            columns={columns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick={true}
                            loading={warningNoticesLoading}
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

export default WarningNoticeDialog
